import React from 'react';
import type { View } from '../../App';
import { useClientDataManager } from '../hooks/useClientDataManager';
import PotencialesControls from './sidebar/PotencialesControls';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeView: View;
    onNavClick: (view: View) => void;
    isDatabaseUnlocked: boolean;
    isSettingCenter: boolean;
    onSetCenterClick: () => void;
    clientDataManager: ReturnType<typeof useClientDataManager>;
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
}) => {
    return (
        <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
            <div className={`relative w-full max-w-sm bg-white dark:bg-slate-800 h-full shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Menú</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700" aria-label="Cerrar menú">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-65px)]">
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
    );
};

export default Sidebar;