import { useEffect } from 'react';

type UseDarkModeOutput = [boolean, () => void];

/**
 * A custom React hook to manage the application's dark mode.
 * It is now hardcoded to always return dark mode to match the new site theme.
 */
const useDarkMode = (): UseDarkModeOutput => {
    // Hardcode to true for a persistent dark theme
    const isDarkMode = true;

    // The toggle function does nothing now.
    const toggleDarkMode = () => {};

    // This effect runs once to apply the 'dark' class.
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;
