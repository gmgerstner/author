import { useEffect, useRef, useState } from 'react';
import { loadHCaptcha } from '../utils/hcaptcha';
import {
    HCAPTCHA_SITE_KEY,
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    SUBMISSIONS_BUCKET,
    MAX_EPUB_BYTES,
    isSupabaseConfigured,
} from '../config/supabase';

const GENRES = [
    'Science Fiction',
    'Space Opera',
    'Military Sci-Fi',
    'Fantasy',
    'Epic Fantasy',
    'Urban Fantasy',
    'Dystopian',
    'Post-Apocalyptic',
    'Cyberpunk',
    'Thriller',
    'Mystery',
    'Horror',
    'Romance',
    'Historical',
    'Literary',
    'Young Adult',
    'Middle Grade',
    'Non-Fiction',
];

// Turns "My Book: Part 1!" into "my-book-part-1" so it is safe as a storage path.
function slugify(text, fallback) {
    const slug = text
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
    return slug || fallback;
}

function safeFileName(name) {
    const base = name.replace(/\.epub$/i, '');
    return `${slugify(base, 'book')}.epub`;
}

async function readError(response, prefix) {
    try {
        const data = await response.json();
        const detail = data?.message || data?.msg || data?.error_description || data?.error;
        if (detail) return `${prefix}: ${detail}`;
    } catch {
        /* response had no JSON body */
    }
    return `${prefix} (${response.status}).`;
}

// Supabase verifies the hCaptcha token server-side, then issues a short-lived
// anonymous session. Only those sessions are allowed to upload by the Storage policy.
async function signInWithCaptcha(captchaToken) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            apikey: SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: {}, gotrue_meta_security: { captcha_token: captchaToken } }),
    });
    if (!response.ok) throw new Error(await readError(response, 'Captcha check failed'));
    const data = await response.json();
    const accessToken = data.access_token || data.session?.access_token;
    if (!accessToken) throw new Error('Captcha check failed: no session returned.');
    return accessToken;
}

async function uploadToStorage(path, body, contentType, accessToken) {
    const url = `${SUPABASE_URL}/storage/v1/object/${SUBMISSIONS_BUCKET}/${path}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': contentType,
            'x-upsert': 'false',
            'cache-control': '3600',
        },
        body,
    });

    if (!response.ok) throw new Error(await readError(response, 'Upload failed'));
}

function buildInfoText(fields, genres, epubPath, submittedAt) {
    const line = (label, value) => `${label}: ${value || '(not provided)'}`;
    return [
        'AUTHOR BOOK SUBMISSION',
        '======================',
        line('Submitted', submittedAt),
        '',
        line('Author name', fields.authorName),
        line('Pen name', fields.penName),
        line('Email', fields.email),
        line('Website', fields.website),
        '',
        line('Book title', fields.bookTitle),
        line('Series', fields.series),
        line('Genres', genres.join(', ')),
        '',
        line('EPUB file', epubPath),
        line('Original filename', fields.originalFileName),
        line('File size (bytes)', String(fields.fileSize)),
        '',
        'BLURB',
        '-----',
        fields.blurb,
        '',
        'NOTES',
        '-----',
        fields.notes || '(none)',
        '',
        line('Confirmed rights to share', 'Yes'),
        '',
    ].join('\n');
}

export default function AuthorSubmitPage() {
    const [genres, setGenres] = useState([]);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');
    const captchaRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
        if (!isSupabaseConfigured()) return undefined;
        let cancelled = false;

        loadHCaptcha()
            .then((hcaptcha) => {
                if (cancelled || !captchaRef.current) return;
                widgetIdRef.current = hcaptcha.render(captchaRef.current, {
                    sitekey: HCAPTCHA_SITE_KEY,
                    theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
                    callback: (token) => setCaptchaToken(token),
                    'expired-callback': () => setCaptchaToken(''),
                    'error-callback': () => setCaptchaToken(''),
                });
            })
            .catch(() => {
                if (!cancelled) {
                    setStatus({ type: 'error', message: 'Could not load the captcha. Please refresh the page and try again.' });
                }
            });

        return () => {
            cancelled = true;
            if (widgetIdRef.current !== null) {
                window.hcaptcha?.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, []);

    const resetCaptcha = () => {
        setCaptchaToken('');
        if (widgetIdRef.current !== null) window.hcaptcha?.reset(widgetIdRef.current);
    };

    // Keep this unlisted page out of search engines.
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
        const previousTitle = document.title;
        document.title = 'Author Book Submission | GMG Novels';
        return () => {
            meta.remove();
            document.title = previousTitle;
        };
    }, []);

    const toggleGenre = (genre) => {
        setGenres((current) =>
            current.includes(genre) ? current.filter((g) => g !== genre) : [...current, genre]
        );
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        // Honeypot: real people never see or fill this field.
        if (data.get('company_website')) {
            setStatus({ type: 'success', message: 'Thank you! Your submission was received.' });
            form.reset();
            setGenres([]);
            return;
        }

        if (!isSupabaseConfigured()) {
            setStatus({ type: 'error', message: 'Submissions are not configured yet. Please check back soon.' });
            return;
        }

        if (!captchaToken) {
            setStatus({ type: 'error', message: 'Please complete the captcha check before submitting.' });
            return;
        }

        const otherGenre = (data.get('otherGenre') || '').trim();
        const allGenres = otherGenre ? [...genres, otherGenre] : genres;
        if (allGenres.length === 0) {
            setStatus({ type: 'error', message: 'Please choose at least one genre.' });
            return;
        }

        const epub = data.get('epub');
        if (!epub || !epub.name) {
            setStatus({ type: 'error', message: 'Please attach your EPUB file.' });
            return;
        }
        if (!/\.epub$/i.test(epub.name)) {
            setStatus({ type: 'error', message: 'The attached file must be an .epub file.' });
            return;
        }
        if (epub.size > MAX_EPUB_BYTES) {
            setStatus({ type: 'error', message: 'That EPUB is larger than 50 MB. Please upload a smaller file.' });
            return;
        }

        const fields = {
            authorName: data.get('authorName').trim(),
            penName: data.get('penName').trim(),
            email: data.get('email').trim(),
            website: data.get('website').trim(),
            bookTitle: data.get('bookTitle').trim(),
            series: data.get('series').trim(),
            blurb: data.get('blurb').trim(),
            notes: data.get('notes').trim(),
            originalFileName: epub.name,
            fileSize: epub.size,
        };

        const submittedAt = new Date().toISOString();
        const stamp = submittedAt.replace(/[:.]/g, '-');
        const random = Math.random().toString(36).slice(2, 8);
        const folder = `${stamp}_${slugify(fields.bookTitle, 'untitled')}_${random}`;
        const epubName = safeFileName(epub.name);
        const epubPath = `${folder}/${epubName}`;

        setSubmitting(true);
        setStatus({ type: 'info', message: 'Uploading your book… please keep this page open.' });

        try {
            const accessToken = await signInWithCaptcha(captchaToken);
            // Upload the EPUB first so an info file only exists for complete submissions.
            await uploadToStorage(epubPath, epub, 'application/epub+zip', accessToken);
            const info = buildInfoText(fields, allGenres, epubName, submittedAt);
            await uploadToStorage(`${folder}/info.txt`, new Blob([info], { type: 'text/plain' }), 'text/plain', accessToken);

            window.gtag?.('event', 'author_submission', { form: 'author-submit' });
            setStatus({ type: 'success', message: 'Thank you! Your book was submitted successfully.' });
            form.reset();
            setGenres([]);
        } catch (err) {
            setStatus({
                type: 'error',
                message: `${err.message || 'Something went wrong.'} Please try again.`,
            });
        } finally {
            setSubmitting(false);
            // hCaptcha tokens are single-use, so issue a fresh challenge after every attempt.
            resetCaptcha();
        }
    };

    return (
        <div className="inner-page">
            <div className="page-header">
                <div className="page-header-inner">
                    <span className="section-kicker">For Authors</span>
                    <h1 className="page-title">Submit Your Book</h1>
                </div>
            </div>

            <div className="section-inner">
                <p className="contact-intro">
                    Share your book's details and attach the EPUB below. Fields marked with * are required.
                </p>

                <div className="contact-form-wrap">
                    <form className="contact-form" onSubmit={onSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="authorName">Author Name *</label>
                                <input type="text" id="authorName" name="authorName" maxLength="120" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="penName">Pen Name</label>
                                <input type="text" id="penName" name="penName" maxLength="120" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input type="email" id="email" name="email" maxLength="200" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="website">Website / Social Link</label>
                                <input type="url" id="website" name="website" maxLength="300" placeholder="https://" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="bookTitle">Book Title *</label>
                                <input type="text" id="bookTitle" name="bookTitle" maxLength="200" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="series">Series &amp; Book Number</label>
                                <input type="text" id="series" name="series" maxLength="200" placeholder="e.g. The Star Chronicles, Book 2" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="blurb">Blurb *</label>
                            <textarea id="blurb" name="blurb" rows="8" maxLength="5000" required></textarea>
                        </div>

                        <fieldset className="form-group genre-fieldset">
                            <legend>Genres * (choose all that apply)</legend>
                            <div className="genre-grid">
                                {GENRES.map((genre) => (
                                    <label key={genre} className="genre-option">
                                        <input
                                            type="checkbox"
                                            checked={genres.includes(genre)}
                                            onChange={() => toggleGenre(genre)}
                                        />
                                        <span>{genre}</span>
                                    </label>
                                ))}
                            </div>
                            <input
                                type="text"
                                name="otherGenre"
                                maxLength="100"
                                placeholder="Other genre (optional)"
                                aria-label="Other genre"
                            />
                        </fieldset>

                        <div className="form-group">
                            <label htmlFor="epub">EPUB File * (max 50 MB)</label>
                            <input
                                type="file"
                                id="epub"
                                name="epub"
                                accept=".epub,application/epub+zip"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Anything Else?</label>
                            <textarea id="notes" name="notes" rows="4" maxLength="3000"></textarea>
                        </div>

                        {/* Honeypot field for bots — hidden from people. */}
                        <div className="hp-field" aria-hidden="true">
                            <label htmlFor="company_website">Leave this empty</label>
                            <input type="text" id="company_website" name="company_website" tabIndex="-1" autoComplete="off" />
                        </div>

                        <label className="rights-confirm">
                            <input type="checkbox" name="rights" required />
                            <span>I am the author or rights holder and I have permission to share this book. *</span>
                        </label>

                        <div ref={captchaRef} className="captcha-wrap"></div>

                        <div>
                            <button type="submit" className="btn btn-primary" disabled={submitting || !captchaToken}>
                                {submitting ? 'Uploading…' : 'Submit Book'}
                            </button>
                        </div>
                    </form>

                    {status.message && (
                        <div className={`form-result ${status.type === 'success' ? 'success' : status.type === 'error' ? 'error' : 'info'}`}>
                            {status.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
