import { useEffect, useRef, useState } from 'react';
import { loadHCaptcha } from '../utils/hcaptcha';

// Web3Forms' shared hCaptcha site key for free plans; Web3Forms verifies the token server-side.
const HCAPTCHA_SITE_KEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

export default function Contact() {
    const [result, setResult] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const captchaRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
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
                if (!cancelled) setResult('Could not load the captcha. Please refresh the page and try again.');
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

    const onSubmit = async (event) => {
        event.preventDefault();

        if (!captchaToken) {
            setResult('Please complete the captcha check before sending.');
            return;
        }

        setResult('Sending...');
        const form = event.target;
        const formData = new FormData(form);
        formData.append('access_key', '3df89f65-f039-4d24-bc1f-2f2c87f85be4');
        formData.set('h-captcha-response', captchaToken);
        formData.delete('g-recaptcha-response');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                window.gtag?.('event', 'generate_lead', { form: 'contact' });
                setResult('Message sent successfully! I\'ll be in touch soon.');
                form.reset();
            } else {
                setResult(data.message || 'Something went wrong. Please try again.');
            }
        } catch {
            setResult('Something went wrong. Please try again.');
        } finally {
            // hCaptcha tokens are single-use, so issue a fresh challenge after every attempt.
            resetCaptcha();
        }
    };

    const isSuccess = result.includes('successfully');

    return (
        <div className="inner-page">

            <div className="page-header">
                <div className="page-header-inner">
                    <span className="section-kicker">Get In Touch</span>
                    <h1 className="page-title">Contact</h1>
                </div>
            </div>

            <div className="section-inner">
                <p className="contact-intro">
                    I love hearing from readers! Whether you want to share your thoughts on my books,
                    ask a question, or just say hello — I'd love to connect with you.
                </p>

                <div className="contact-form-wrap">
                    <form className="contact-form" onSubmit={onSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input type="text" id="name" name="name" placeholder="Jane Smith" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" placeholder="jane@example.com" required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" name="subject" placeholder="What's on your mind?" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Your Message</label>
                            <textarea id="message" name="message" rows="6" placeholder="Write your message here..." required></textarea>
                        </div>
                        <div ref={captchaRef} className="captcha-wrap"></div>
                        <div>
                            <button type="submit" className="btn btn-primary" disabled={!captchaToken}>Send Message</button> <span>(No offers for services)</span>
                        </div>
                    </form>

                    {result && (
                        <div className={`form-result${isSuccess ? ' success' : ' error'}`}>
                            {result}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
