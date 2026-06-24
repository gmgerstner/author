import { useEffect, useRef } from 'react';

const KIT_UID = 'ba7aeff63f';
const SESSION_KEY = 'kit-popup-shown';
const SCROLL_THRESHOLD = 0.30;

function KitScrollPopup() {
    const triggerRef = useRef(null);

    useEffect(() => {
        if (!document.querySelector(`script[data-uid="${KIT_UID}"]`)) {
            const script = document.createElement('script');
            script.src = `https://gmgdigitaltechnologies.kit.com/${KIT_UID}/index.js`;
            script.setAttribute('data-uid', KIT_UID);
            script.async = true;
            document.head.appendChild(script);
        }

        if (sessionStorage.getItem(SESSION_KEY)) return;

        let triggered = false;

        const handleScroll = () => {
            if (triggered) return;
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollable <= 0) return;
            if (window.scrollY / scrollable >= SCROLL_THRESHOLD) {
                triggered = true;
                sessionStorage.setItem(SESSION_KEY, '1');
                setTimeout(() => triggerRef.current?.click(), 300);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <button
            ref={triggerRef}
            data-formkit-toggle={KIT_UID}
            aria-hidden="true"
            tabIndex={-1}
            style={{ position: 'fixed', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />
    );
}

export default KitScrollPopup;
