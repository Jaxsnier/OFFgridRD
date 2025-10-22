import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const storedTheme = localStorage.getItem('theme');
        // Si hay un tema guardado en localStorage, úsalo.
        if (storedTheme) {
            return storedTheme === 'dark';
        }
        // Si no, inicia en modo claro (isDarkMode = false) por defecto.
        return false;
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return { isDarkMode, toggleDarkMode };
};
