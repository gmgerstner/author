// Shared loader for the hCaptcha script, used by the Contact and Author Submit pages.

// recaptchacompat=off stops hCaptcha adding a g-recaptcha-response field, which Web3Forms treats as (Pro-only) reCaptcha.
const HCAPTCHA_SCRIPT = 'https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off';

let hcaptchaLoader;
export function loadHCaptcha() {
    if (window.hcaptcha) return Promise.resolve(window.hcaptcha);
    if (!hcaptchaLoader) {
        hcaptchaLoader = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = HCAPTCHA_SCRIPT;
            script.async = true;
            script.onload = () => resolve(window.hcaptcha);
            script.onerror = () => {
                hcaptchaLoader = null;
                reject(new Error('hCaptcha failed to load'));
            };
            document.head.appendChild(script);
        });
    }
    return hcaptchaLoader;
}
