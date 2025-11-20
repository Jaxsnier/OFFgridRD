import React from 'react';

interface AuthSwitchFooterProps {
    isRegistering: boolean;
    onToggle: () => void;
}

const AuthSwitchFooter: React.FC<AuthSwitchFooterProps> = ({ isRegistering, onToggle }) => {
    return (
        <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
                {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                <button 
                    onClick={onToggle}
                    className="ml-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                >
                    {isRegistering ? 'Inicia sesión' : 'Regístrate aquí'}
                </button>
            </p>
        </div>
    );
};

export default AuthSwitchFooter;