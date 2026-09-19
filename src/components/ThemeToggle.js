function ThemeToggle({ theme, onToggle, className = '' }) {
    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <button
            type="button"
            className={`theme-toggle${className ? ' ' + className : ''}`}
            onClick={onToggle}
            title={label}
            aria-label={label}
            aria-pressed={isDark}
        >
            {isDark ? (
                /* Moon — click to go light */
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                        d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"
                        fill="currentColor"
                    />
                </svg>
            ) : (
                /* Sun — click to go dark */
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <line x1="12" y1="1.8" x2="12" y2="4.4" />
                        <line x1="12" y1="19.6" x2="12" y2="22.2" />
                        <line x1="1.8" y1="12" x2="4.4" y2="12" />
                        <line x1="19.6" y1="12" x2="22.2" y2="12" />
                        <line x1="4.8" y1="4.8" x2="6.6" y2="6.6" />
                        <line x1="17.4" y1="17.4" x2="19.2" y2="19.2" />
                        <line x1="19.2" y1="4.8" x2="17.4" y2="6.6" />
                        <line x1="6.6" y1="17.4" x2="4.8" y2="19.2" />
                    </g>
                </svg>
            )}
        </button>
    );
}

export default ThemeToggle;
