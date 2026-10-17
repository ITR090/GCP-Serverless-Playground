import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const LIGHT = 'lumen';
const DARK = 'lumen-dark';

function getInitialTheme() {
    const saved = document.documentElement.getAttribute('data-theme');
    if (saved === LIGHT || saved === DARK) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
}

const ThemeToggle = () => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('theme', theme); } catch { /* storage unavailable */ }
    }, [theme]);

    const isDark = theme === DARK;
    return (
        <button
            type="button"
            className="btn btn-ghost btn-square"
            onClick={() => setTheme(isDark ? LIGHT : DARK)}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
        >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
    );
};

export default ThemeToggle;
