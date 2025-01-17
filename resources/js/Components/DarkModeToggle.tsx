import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setIsAnimating(true);
        setIsDarkMode((prev) => !prev);
        const newMode = !isDarkMode;
        localStorage.setItem('darkMode', String(newMode));

        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Reset animation after it completes
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className={`
                relative p-2 rounded-full
                transition-all duration-300 ease-in-out
                focus:outline-none
                ${isAnimating ? 'scale-90' : 'scale-100'}
            `}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div className="relative w-6 h-6">
                <div
                    className={`
                        absolute inset-0 transition-opacity duration-300
                        ${isDarkMode ? 'opacity-0' : 'opacity-100'}
                    `}
                >
                    <Sun
                        className="w-6 h-6 text-yellow-500"
                        strokeWidth={2.5}
                    />
                </div>
                <div
                    className={`
                        absolute inset-0 transition-opacity duration-300
                        ${isDarkMode ? 'opacity-100' : 'opacity-0'}
                    `}
                >
                    <Moon
                        className="w-6 h-6 text-blue-200"
                        strokeWidth={2.5}
                    />
                </div>
            </div>
        </button>
    );
};

export default DarkModeToggle;
