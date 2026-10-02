import { useEffect, useState } from 'react';

const KIT_UID = 'ba7aeff63f';
const DISMISS_KEY = 'kit-float-dismissed';
const SUBSCRIBED_KEY = 'kit-subscribed';

function isDismissed() {
    try {
        return !!sessionStorage.getItem(DISMISS_KEY) || !!localStorage.getItem(SUBSCRIBED_KEY);
    } catch {
        return false;
    }
}

function rememberSubscribed() {
    try {
        localStorage.setItem(SUBSCRIBED_KEY, '1');
    } catch {
        // storage unavailable — box will just reappear next page load
    }
}

function rememberDismissed() {
    try {
        sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
        // storage unavailable — box will just reappear next page load
    }
}

function KitScrollPopup() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(isDismissed);

    useEffect(() => {
        if (!document.querySelector(`script[data-uid="${KIT_UID}"]`)) {
            const script = document.createElement('script');
            script.src = `https://gmgdigitaltechnologies.kit.com/${KIT_UID}/index.js`;
            script.setAttribute('data-uid', KIT_UID);
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

    useEffect(() => {
        if (isDismissed()) return;

        // Short delay so the slide-in transition plays after first paint
        const timer = setTimeout(() => {
            setVisible(true);
            window.gtag?.('event', 'newsletter_float_shown');
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    // Kit (ck.5.js) fires bubbling events: `ckjs:submission:complete` from the form on a
    // successful signup, and `ckjs:overlay:hide` from the modal overlay once it closes.
    useEffect(() => {
        let subscribed = false;

        const handleSubmitted = () => {
            subscribed = true;
            rememberSubscribed();
            setVisible(false);
        };

        const handleOverlayHide = (e) => {
            if (subscribed || isDismissed()) return;
            if (!e.target.querySelector?.(`.formkit-form[data-uid="${KIT_UID}"]`)) return;
            setVisible(true);
        };

        document.addEventListener('ckjs:submission:complete', handleSubmitted);
        document.addEventListener('ckjs:overlay:hide', handleOverlayHide);
        return () => {
            document.removeEventListener('ckjs:submission:complete', handleSubmitted);
            document.removeEventListener('ckjs:overlay:hide', handleOverlayHide);
        };
    }, []);

    if (dismissed) return null;

    const dismiss = () => {
        rememberDismissed();
        setDismissed(true);
    };

    return (
        <aside
            className={`kit-float${visible ? ' kit-float-visible' : ''}`}
            aria-label="Newsletter signup"
            aria-hidden={!visible}
        >
            <button
                type="button"
                className="kit-float-close"
                onClick={dismiss}
                aria-label="Dismiss"
                tabIndex={visible ? 0 : -1}
            >
                ×
            </button>
            <p className="kit-float-text">
                Join our newsletter and stay up to date on new releases in the Arkonus universe.
            </p>
            <button
                type="button"
                data-formkit-toggle={KIT_UID}
                className="btn btn-primary kit-float-btn"
                tabIndex={visible ? 0 : -1}
                onClick={() => {
                    window.gtag?.('event', 'newsletter_open', { source: 'floating_box' });
                    // Hide but stay mounted so Kit's toggle handler still sees this button;
                    // it comes back if the modal is closed without signing up
                    setVisible(false);
                }}
            >
                Sign Me Up
            </button>
        </aside>
    );
}

export default KitScrollPopup;
