import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

interface HeaderProps {
    onMenuClick: () => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    user: firebase.User | null;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isDarkMode, toggleDarkMode, user }) => {
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
                    
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* User Status Badge */}
                        {user ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800 transition-all animate-[fadeIn_0.5s_ease-out]">
                                <div className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </div>
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 hidden sm:block max-w-[100px] truncate">
                                    {user.email?.split('@')[0]}
                                </span>
                                <span className="sm:hidden text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-200 dark:bg-blue-800 w-5 h-5 flex items-center justify-center rounded-full">
                                    {user.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 transition-all">
                                <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block">Invitado</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        )}

                        {/* Night Mode Toggle */}
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
