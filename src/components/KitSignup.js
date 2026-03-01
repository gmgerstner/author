import { useEffect, useRef } from 'react';

function KitSignup() {
    const scriptLoaded = useRef(false);

    useEffect(() => {
        if (scriptLoaded.current) return;
        scriptLoaded.current = true;

        if (!document.querySelector('script[data-uid="ecbfcc2b2f"]')) {
            const script = document.createElement('script');
            script.src = 'https://gmgdigitaltechnologies.kit.com/ecbfcc2b2f/index.js';
            script.setAttribute('data-uid', 'ecbfcc2b2f');
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

    return (
        <div className="kit-signup-wrapper">
            <span className="section-kicker">Free Short Story</span>
            <h2 className="section-title">Join the Reader List</h2>
            <p className="kit-signup-desc">
                Sign up and get the free short story, <i>Turek Station</i>, set in the world of The Sentinel Trilogy.
            </p>
            <button
                data-formkit-toggle="ecbfcc2b2f"
                className="btn btn-primary kit-signup-btn"
                onClick={() => {
                    // Fallback: try Kit's JS API directly if data-formkit-toggle isn't intercepted
                    const form = document.querySelector('.formkit-form[data-uid="ecbfcc2b2f"]');
                    if (form) {
                        form.dispatchEvent(new CustomEvent('kit:open', { bubbles: true }));
                    }
                }}
            >
                Get Your Free Story
            </button>
        </div>
    );
}

export default KitSignup;
