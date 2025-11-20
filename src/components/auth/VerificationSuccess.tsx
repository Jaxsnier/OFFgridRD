import React from 'react';

interface VerificationSuccessProps {
    email: string;
    onClose: () => void;
}

const VerificationSuccess: React.FC<VerificationSuccessProps> = ({ email, onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-8 text-center animate-[fadeInUp_0.3s_ease-out]">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">¡Confirma tu correo!</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Hemos enviado un enlace de verificación a <strong>{email}</strong>. Por favor, revisa tu bandeja de entrada (y spam) para activar tu cuenta.
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow transition-colors"
                >
                    Entendido
                </button>
            </div>
        </div>
    );
};

export default VerificationSuccess;