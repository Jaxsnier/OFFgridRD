import React from 'react';
import { UserRole, ROLE_LABELS, ROLE_BADGE_CLASSES } from './rolesConfig';

interface RoleAccessGateProps {
    currentRole: UserRole;
    requiredRoleText: string;
    sectionName: string;
    isLoggedIn: boolean;
    onGoHome: () => void;
    onOpenMenu: () => void;
}

export const RoleAccessGate: React.FC<RoleAccessGateProps> = ({
    currentRole,
    requiredRoleText,
    sectionName,
    isLoggedIn,
    onGoHome,
    onOpenMenu
}) => {
    return (
        <div className="min-h-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Acceso Restringido por Rol
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                    La sección <strong>{sectionName}</strong> requiere permisos de{' '}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{requiredRoleText}</span>.
                </p>

                <div className="mt-4 mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Tu nivel de acceso actual:</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold border ${ROLE_BADGE_CLASSES[currentRole]}`}>
                        {ROLE_LABELS[currentRole]}
                    </span>
                </div>

                <div className="space-y-2.5">
                    {!isLoggedIn && (
                        <button
                            type="button"
                            onClick={onOpenMenu}
                            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition"
                        >
                            Iniciar Sesión desde el Menú
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onGoHome}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm transition"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleAccessGate;
