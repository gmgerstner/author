import { useCallback, useEffect, useState } from 'react';
import themeConfig from '../data/theme.json';

const THEMES = ['dark', 'light'];

const config = {
    defaultTheme: 'dark',
    followSystemPreference: false,
    rememberUserChoice: true,
    storageKey: 'gmg-theme',
    ...themeConfig,
};

const fallbackTheme = THEMES.includes(config.defaultTheme) ? config.defaultTheme : 'dark';

function readStoredTheme() {
    if (!config.rememberUserChoice) return null;
    try {
        const stored = window.localStorage.getItem(config.storageKey);
        return THEMES.includes(stored) ? stored : null;
    } catch {
        // Private browsing / storage disabled — fall through to the configured default.
        return null;
    }
}

function readSystemTheme() {
    if (!config.followSystemPreference || !window.matchMedia) return null;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/* Saved choice wins, then the OS preference, then the JSON default. */
function resolveTheme() {
    return readStoredTheme() || readSystemTheme() || fallbackTheme;
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

/* Applied at module load so the page paints with the right theme on first render. */
applyTheme(resolveTheme());

export default function useTheme() {
    const [theme, setTheme] = useState(resolveTheme);

    useEffect(() => {
        applyTheme(theme);
        if (!config.rememberUserChoice) return;
        try {
            window.localStorage.setItem(config.storageKey, theme);
        } catch {
            // Nothing to do — the theme still applies for this visit.
        }
    }, [theme]);

    /* Follow the OS while the visitor has not picked a theme themselves. */
    useEffect(() => {
        if (!config.followSystemPreference || !window.matchMedia) return;
        if (readStoredTheme()) return;

        const query = window.matchMedia('(prefers-color-scheme: light)');
        const onChange = e => setTheme(e.matches ? 'light' : 'dark');
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    }, []);

    return { theme, toggleTheme };
}
