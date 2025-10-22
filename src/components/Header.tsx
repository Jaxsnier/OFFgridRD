import React from 'react';

interface HeaderProps {
    onMenuClick: () => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isDarkMode, toggleDarkMode }) => {
    return (
        <header className="flex-shrink-0 bg-white dark:bg-slate-800 shadow z-40 transition-colors duration-300">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={onMenuClick} className="block p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-colors" aria-label="Abrir menú">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 md:ml-0 ml-3 transition-colors">OFFgridRD</h1>
                    </div>
                    
                    {/* Night Mode Toggle */}
                    <div className="flex items-center">
                        <button 
                            onClick={toggleDarkMode}
                            className="relative w-10 h-10 flex items-center justify-center p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
                            aria-label={isDarkMode ? "Activar modo claro" : "Activar modo noche"}
                        >
                            <span className="sr-only">Cambiar tema</span>
                            {/* Sun Icon (Visible in Light Mode) */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`absolute h-6 w-6 transition-all duration-300 ease-in-out transform ${isDarkMode ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor" 
                                strokeWidth={2}
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {/* Moon Icon (Visible in Dark Mode) */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`absolute h-6 w-6 transition-all duration-300 ease-in-out transform ${isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor" 
                                strokeWidth={2}
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;