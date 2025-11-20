import React, { useState } from 'react';
import type { View } from '../../App';
import { useClientDataManager } from '../hooks/useClientDataManager';
import PotencialesControls from './sidebar/PotencialesControls';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeView: View;
    onNavClick: (view: View) => void;
    isDatabaseUnlocked: boolean;
    isSettingCenter: boolean;
    onSetCenterClick: () => void;
    clientDataManager: ReturnType<typeof useClientDataManager>;
    auth: ReturnType<typeof useAuth>;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    activeView,
    onNavClick,
    isDatabaseUnlocked,
    isSettingCenter,
    onSetCenterClick,
    clientDataManager,
    auth
}) => {
    const { user, login, logout, register, resendVerificationEmail, reloadUser } = auth;
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleResendEmail = async () => {
        setResendStatus('sending');
        const result = await resendVerificationEmail();
        if (result.success) {
            setResendStatus('sent');
            setTimeout(() => setResendStatus('idle'), 3000);
        } else {
            setResendStatus('error');
            setTimeout(() => setResendStatus('idle'), 3000);
        }
    };

    const handleReloadUser = async () => {
        await reloadUser();
    };

    return (
        <>
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
                onLogin={login}
                onRegister={register} 
            />
            
            <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
                <div className={`relative w-full max-w-sm bg-white dark:bg-slate-800 h-full shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    
                    {/* Header del Sidebar */}
                    <div className="p-4 border-b dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white whitespace-nowrap">Menú</h2>
                             <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700" aria-label="Cerrar menú">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Botón de Auth o Info de Usuario */}
                        <div className="w-full">
                            {user ? (
                                <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="w-8 h-8 min-w-[2rem] rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate" title={user.email || ''}>
                                                {user.email}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={logout} 
                                            className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors ml-2"
                                        >
                                            Salir
                                        </button>
                                    </div>

                                    {/* Verification Warning */}
                                    {!user.emailVerified && (
                                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                                            <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 mb-1 font-semibold">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Correo no verificado
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={handleResendEmail}
                                                    disabled={resendStatus === 'sending' || resendStatus === 'sent'}
                                                    className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex-1"
                                                >
                                                    {resendStatus === 'sending' ? 'Enviando...' : resendStatus === 'sent' ? '¡Enviado!' : 'Reenviar'}
                                                </button>
                                                <button 
                                                    onClick={handleReloadUser}
                                                    className="text-xs bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300 px-2 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                                                    title="Refrescar estado"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsLoginModalOpen(true)}
                                    className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border border-transparent rounded-md text-sm font-bold transition-all shadow-md hover:shadow-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Iniciar Sesión
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-y-auto h-[calc(100vh-140px)]">
                        <nav className="p-4 border-b dark:border-slate-700">
                            <ul>
                                 <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('inicio'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'inicio' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                        Inicio
                                    </a>
                                </li>
                                 <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('calculadora'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'calculadora' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                        Calculadora Solar
                                    </a>
                                </li>
                                 <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('instalacion_personalizada'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'instalacion_personalizada' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                        Instalación Personalizada
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('potenciales'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'potenciales' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                        Base De Datos
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('nosotros'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'nosotros' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                        Nosotros
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        
                        {activeView === 'potenciales' && (
                            <PotencialesControls
                                isDatabaseUnlocked={isDatabaseUnlocked}
                                isSettingCenter={isSettingCenter}
                                onSetCenterClick={onSetCenterClick}
                                clientDataManager={clientDataManager}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;