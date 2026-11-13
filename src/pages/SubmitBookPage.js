import { useEffect, useRef, useState } from 'react';
import authorData from '../data/author.json';
import config from '../data/submissions.json';
import questionsData from '../data/submission-questions.json';

// This page follows author-review-system/docs/submission-page-contract.md:
// CAPTCHA -> anonymous sign-in -> upload the file -> insert one row -> sign out.

const CAPTCHA_PROVIDERS = {
    turnstile: {
        script: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
        global: 'turnstile',
    },
    hcaptcha: {
        script: 'https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off',
        global: 'hcaptcha',
    },
};

const captchaProvider = CAPTCHA_PROVIDERS[config.captchaProvider] || CAPTCHA_PROVIDERS.turnstile;
const isConfigured = Boolean(config.supabaseUrl && config.supabasePublishableKey && config.captchaSiteKey);
const maxFileBytes = config.maxFileSizeMb * 1024 * 1024;
const BLURB_MAX = 2000; // the review system cuts longer values off
const REVIEW_SITES = ['Facebook', 'Instagram', 'Bluesky'];

const PUBLICATION_STATUSES = ['Published', 'Advance copy, release date set', 'Not yet published'];
const SERIES_OPTIONS = ['Standalone', 'First book in a series', 'Later book in a series'];

let captchaLoader;
function loadCaptcha() {
    if (window[captchaProvider.global]) return Promise.resolve(window[captchaProvider.global]);
    if (!captchaLoader) {
        captchaLoader = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = captchaProvider.script;
            script.async = true;
            script.onload = () => resolve(window[captchaProvider.global]);
            script.onerror = () => {
                captchaLoader = null;
                reject(new Error('Captcha failed to load'));
            };
            document.head.appendChild(script);
        });
    }
    return captchaLoader;
}

// Every EPUB is a zip archive, and every zip starts with the bytes "PK".
async function looksLikeEpub(file) {
    const bytes = new Uint8Array(await file.slice(0, 2).arrayBuffer());
    return bytes[0] === 0x50 && bytes[1] === 0x4b;
}

function isWebLink(text) {
    try {
        return /^https?:$/.test(new URL(text).protocol);
    } catch {
        return false;
    }
}

function FieldError({ message }) {
    return message ? <span className="field-error">{message}</span> : null;
}

function friendlyError(error) {
    const message = (error?.message || '').toLowerCase();
    if (message.includes('captcha')) return 'The captcha check failed. Please complete it again and resubmit.';
    if (message.includes('size') || message.includes('too large')) {
        return `That file is too large. The limit is ${config.maxFileSizeMb} MB.`;
    }
    if (message.includes('mime')) return 'That file was not accepted. Please upload an EPUB file.';
    if (message.includes('rate limit')) return 'Too many attempts from your network. Please try again in an hour.';
    return 'Something went wrong and your book was not submitted. Please try again.';
}

function Question({ question, value, other, error, onChange, onOtherChange }) {
    const multi = question.type !== 'single';
    const selected = multi ? value || [] : value || '';
    const isChecked = (answer) => (multi ? selected.includes(answer) : selected === answer);

    const toggle = (answer) => {
        if (!multi) return onChange(answer);
        onChange(isChecked(answer) ? selected.filter((a) => a !== answer) : [...selected, answer]);
    };

    const answers = question.allowOther ? [...question.answers, 'Other'] : question.answers;

    return (
        <fieldset className={`submit-question${error ? ' has-error' : ''}`}>
            <legend>
                {question.text}
                {question.required ? '' : ' (optional)'}
            </legend>
            <FieldError message={error} />
            <div className="submit-options">
                {answers.map((answer) => (
                    <label key={answer} className="submit-option">
                        <input
                            type={multi ? 'checkbox' : 'radio'}
                            name={`question-${question.id}`}
                            checked={isChecked(answer)}
                            onChange={() => toggle(answer)}
                        />
                        <span>{answer}</span>
                    </label>
                ))}
            </div>
            {question.allowOther && isChecked('Other') && (
                <input
                    type="text"
                    className="submit-other"
                    aria-label={`Other: ${question.text}`}
                    placeholder="Please specify"
                    maxLength={200}
                    value={other || ''}
                    onChange={(e) => onOtherChange(e.target.value)}
                />
            )}
        </fieldset>
    );
}

function answerText(question, value, other) {
    const list = (Array.isArray(value) ? value : [value]).filter(Boolean);
    return list
        .map((answer) => (answer === 'Other' && question.allowOther && other?.trim() ? `Other: ${other.trim()}` : answer))
        .join(', ');
}

export default function SubmitBookPage() {
    const [answers, setAnswers] = useState({});
    const [others, setOthers] = useState({});
    const [blurbLength, setBlurbLength] = useState(0);
    const [captchaToken, setCaptchaToken] = useState('');
    const [result, setResult] = useState('');
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const captchaRef = useRef(null);
    const widgetIdRef = useRef(null);

    const showForm = config.open && isConfigured && !done;

    // A mark disappears as soon as the visitor changes that field.
    const clearError = (name) => setErrors((e) => {
        if (!e[name]) return e;
        const { [name]: _removed, ...rest } = e;
        return rest;
    });
    const groupClass = (name) => `form-group${errors[name] ? ' has-error' : ''}`;

    // The page is deliberately not linked from the rest of the site; keep it out of search results too.
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
        return () => meta.remove();
    }, []);

    useEffect(() => {
        if (!showForm) return undefined;
        let cancelled = false;

        loadCaptcha()
            .then((captcha) => {
                if (cancelled || !captchaRef.current) return;
                widgetIdRef.current = captcha.render(captchaRef.current, {
                    sitekey: config.captchaSiteKey,
                    theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
                    callback: (token) => {
                        setCaptchaToken(token);
                        setErrors((e) => ({ ...e, captcha: '' }));
                    },
                    'expired-callback': () => setCaptchaToken(''),
                    'error-callback': () => setCaptchaToken(''),
                });
            })
            .catch(() => {
                if (!cancelled) setResult('Could not load the captcha. Please refresh the page and try again.');
            });

        return () => {
            cancelled = true;
            if (widgetIdRef.current !== null) {
                window[captchaProvider.global]?.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [showForm]);

    const resetCaptcha = () => {
        setCaptchaToken('');
        if (widgetIdRef.current !== null) window[captchaProvider.global]?.reset(widgetIdRef.current);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const field = (name) => form.elements[name].value.trim();
        const file = form.elements.epub.files[0];

        // Collect every problem at once so they can all be marked, keyed by input name.
        const found = {};
        if (!field('name')) found.name = 'Please enter your name.';
        if (!field('email')) found.email = 'Please enter your email address.';
        else if (!/^\S+@\S+\.\S+$/.test(field('email'))) found.email = 'Please enter a valid email address.';
        if (!field('bookTitle')) found.bookTitle = 'Please enter the book title.';
        if (!field('publicationStatus')) found.publicationStatus = 'Please choose a publication status.';
        if (!field('series')) found.series = 'Please choose one.';
        if (field('authorLink') && !isWebLink(field('authorLink'))) {
            found.authorLink ='Please enter a full link starting with https://, or leave this blank.';
        }
        questionsData.questions.forEach((q) => {
            const value = answers[q.id];
            const empty = Array.isArray(value) ? value.length === 0 : !value;
            if (q.required && empty) found[`question-${q.id}`] = 'Please choose an answer.';
        });
        if (!field('blurb')) found.blurb = 'Please enter the book description.';
        if (!file) found.epub = 'Please choose your EPUB file.';
        else if (!/\.epub$/i.test(file.name) || !(await looksLikeEpub(file))) found.epub = 'This is not an EPUB file (.epub).';
        else if (file.size > maxFileBytes) found.epub = `This file is too large. The limit is ${config.maxFileSizeMb} MB.`;
        if (!form.elements.rights.checked) found.rights = 'Please tick this box to continue.';
        if (!captchaToken) found.captcha = 'Please complete the captcha check.';

        setErrors(found);
        const count = Object.keys(found).length;
        if (count > 0) {
            setResult(count === 1 ? 'Please fix the item marked in red above.' : `Please fix the ${count} items marked in red above.`);
            // Wait for the marks to render, then bring the first one into view.
            setTimeout(() => {
                const first = form.querySelector('.has-error');
                first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                first?.querySelector('input, select, textarea')?.focus({ preventScroll: true });
            }, 0);
            return;
        }

        // Extra fields are shown to the reviewer labelled with their key, so the keys are readable.
        const extra = {
            'Publication status': field('publicationStatus'),
            'Series or standalone': field('series'),
        };
        if (field('penName')) extra['Pen name'] = field('penName');
        if (field('authorLink')) extra['Website or social media'] = field('authorLink');
        questionsData.questions.forEach((q) => {
            const text = answerText(q, answers[q.id], others[q.id]);
            if (text) extra[q.label || q.text] = text;
        });
        extra['Blurb'] = field('blurb');
        extra['Rights confirmed'] = 'Yes';
        extra['Questions version'] = String(questionsData.version);

        setSending(true);
        setResult('Uploading your book. Please keep this page open...');

        let supabase;
        try {
            const { createClient } = await import('@supabase/supabase-js');
            supabase = createClient(config.supabaseUrl, config.supabasePublishableKey, {
                auth: { persistSession: false, autoRefreshToken: false },
            });

            const { error: signInError } = await supabase.auth.signInAnonymously({
                options: { captchaToken },
            });
            if (signInError) throw signInError;

            // "<readable name>-<random>.epub": recognisable in the bucket and never collides.
            const slug =
                file.name
                    .replace(/\.epub$/i, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .slice(0, 60) || 'submission';
            const filePath = `${slug}-${crypto.randomUUID().slice(0, 8)}.epub`;

            const { error: uploadError } = await supabase.storage
                .from(config.bucket)
                .upload(filePath, file, { contentType: 'application/epub+zip' });
            if (uploadError) throw uploadError;

            // No .select() here: visitors can add a row but not read one.
            const { error: insertError } = await supabase.from(config.table).insert({
                file_path: filePath,
                file_name: file.name.slice(0, 255),
                author: field('name'),
                email: field('email'),
                subject: field('bookTitle'),
                extra,
            });
            if (insertError) throw insertError;

            window.gtag?.('event', 'book_submission');
            setResult('');
            setDone(true);
        } catch (error) {
            console.error('Book submission failed:', error);
            setResult(friendlyError(error));
            // Captcha tokens are single-use, so a retry needs a fresh one.
            resetCaptcha();
        } finally {
            setSending(false);
            supabase?.auth.signOut().catch(() => {});
        }
    };

    const reviewSites = authorData.socialLinks.filter((link) => REVIEW_SITES.includes(link.name));

    return (
        <div className="inner-page">

            <div className="page-header">
                <div className="page-header-inner">
                    <span className="section-kicker">For Authors</span>
                    <h1 className="page-title">Submit Your Book for Review</h1>
                </div>
            </div>

            <div className="section-inner">
                <div className="submit-about">
                    <p>{config.intro}</p>

                    <h2>What I'm open to reading</h2>
                    <ul>
                        {config.openTo.map((item) => <li key={item}>{item}</li>)}
                    </ul>

                    {config.notAFit.length > 0 && (
                        <>
                            <h2>Not a fit for me</h2>
                            <ul>
                                {config.notAFit.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                        </>
                    )}

                    <h2>How reviews work</h2>
                    <ul>
                        <li>
                            If I rate your book above 3.5 stars, I'll post my review on{' '}
                            {reviewSites.map((link, i) => (
                                <span key={link.name}>
                                    {i > 0 && (i === reviewSites.length - 1 ? ' and ' : ', ')}
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                                </span>
                            ))}
                            .
                        </li>
                        <li>If it comes in at 3.5 stars or below, I won't post a review.</li>
                        <li>
                            It may take me a really long time to get to your book, depending on how many
                            submissions I have and how closely it matches my preferred tastes.
                        </li>
                        <li>
                            There's no guarantee I'll read your book, but its chances improve if it falls
                            within my preferences or the blurb really sells it.
                        </li>
                    </ul>
                </div>

                {done && (
                    <div className="form-result success submit-done">
                        Thank you! Your book has been submitted.
                    </div>
                )}

                {!done && !config.open && (
                    <div className="form-result submit-closed">{config.closedMessage}</div>
                )}

                {!done && config.open && !isConfigured && (
                    <div className="form-result submit-closed">
                        The submission form isn't available yet. Please check back soon.
                    </div>
                )}

                {showForm && (
                    <div className="contact-form-wrap">
                        <form
                            className="contact-form submit-form"
                            onSubmit={onSubmit}
                            onChange={(e) => clearError(e.target.name)}
                            noValidate
                        >
                            <div className="form-row">
                                <div className={groupClass('name')}>
                                    <label htmlFor="name">Your Name</label>
                                    <input type="text" id="name" name="name" maxLength={200} autoComplete="name" required />
                                    <FieldError message={errors.name} />
                                </div>
                                <div className={groupClass('email')}>
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" name="email" maxLength={320} autoComplete="email" required />
                                    <FieldError message={errors.email} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className={groupClass('bookTitle')}>
                                    <label htmlFor="bookTitle">Book Title</label>
                                    <input type="text" id="bookTitle" name="bookTitle" maxLength={300} required />
                                    <FieldError message={errors.bookTitle} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="penName">Pen Name (if different)</label>
                                    <input type="text" id="penName" name="penName" maxLength={200} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className={groupClass('publicationStatus')}>
                                    <label htmlFor="publicationStatus">Publication Status</label>
                                    <select id="publicationStatus" name="publicationStatus" defaultValue="" required>
                                        <option value="" disabled>Choose one</option>
                                        {PUBLICATION_STATUSES.map((s) => <option key={s}>{s}</option>)}
                                    </select>
                                    <FieldError message={errors.publicationStatus} />
                                </div>
                                <div className={groupClass('series')}>
                                    <label htmlFor="series">Series or Standalone</label>
                                    <select id="series" name="series" defaultValue="" required>
                                        <option value="" disabled>Choose one</option>
                                        {SERIES_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                                    </select>
                                    <FieldError message={errors.series} />
                                </div>
                            </div>

                            <div className={groupClass('authorLink')}>
                                <label htmlFor="authorLink">Your Website or Social Media Page (optional)</label>
                                <input type="url" id="authorLink" name="authorLink" maxLength={500} placeholder="https://" />
                                <FieldError message={errors.authorLink} />
                            </div>

                            {questionsData.questions.map((q) => (
                                <Question
                                    key={q.id}
                                    question={q}
                                    value={answers[q.id]}
                                    other={others[q.id]}
                                    error={errors[`question-${q.id}`]}
                                    onChange={(value) => setAnswers((a) => ({ ...a, [q.id]: value }))}
                                    onOtherChange={(value) => setOthers((o) => ({ ...o, [q.id]: value }))}
                                />
                            ))}

                            <div className={groupClass('blurb')}>
                                <label htmlFor="blurb">Book Description / Blurb</label>
                                <textarea
                                    id="blurb"
                                    name="blurb"
                                    rows="7"
                                    maxLength={BLURB_MAX}
                                    onChange={(e) => setBlurbLength(e.target.value.length)}
                                    required
                                ></textarea>
                                <span className="submit-hint">{blurbLength} / {BLURB_MAX}</span>
                                <FieldError message={errors.blurb} />
                            </div>

                            <div className={groupClass('epub')}>
                                <label htmlFor="epub">EPUB File</label>
                                <input type="file" id="epub" name="epub" accept=".epub,application/epub+zip" required />
                                <span className="submit-hint">
                                    One .epub file, up to {config.maxFileSizeMb} MB, without DRM.
                                </span>
                                <FieldError message={errors.epub} />
                            </div>

                            <div className={`submit-check${errors.rights ? ' has-error' : ''}`}>
                                <label className="submit-option submit-consent">
                                    <input type="checkbox" name="rights" required />
                                    <span>
                                        I hold the rights to this book and give {authorData.name} permission to read it for review.
                                    </span>
                                </label>
                                <FieldError message={errors.rights} />
                            </div>

                            <div className={`submit-check${errors.captcha ? ' has-error' : ''}`}>
                                <div ref={captchaRef} className="captcha-wrap"></div>
                                <FieldError message={errors.captcha} />
                            </div>

                            <div>
                                <button type="submit" className="btn btn-primary" disabled={sending}>
                                    {sending ? 'Submitting...' : 'Submit Book'}
                                </button>
                            </div>
                        </form>

                        {result && (
                            <div className={`form-result${sending ? ' success' : ' error'}`} role="status">
                                {result}
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
