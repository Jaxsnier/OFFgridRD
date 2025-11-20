import React, { useState, useRef } from 'react';
import VerificationSuccess from './auth/VerificationSuccess';
import ModalHeader from './auth/ModalHeader';
import PasswordInputGroup from './auth/PasswordInputGroup';
import AuthSwitchFooter from './auth/AuthSwitchFooter';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    onRegister: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    
    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Refs for inputs to handle focus
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setVerificationSent(false);
    };

    const handleClose = () => {
        onClose();
        // Reset state after animation
        setTimeout(() => {
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');
            setVerificationSent(false);
            setIsRegistering(false);
            setShowPassword(false);
            setShowConfirmPassword(false);
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isRegistering && password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);

        let result;
        if (isRegistering) {
            result = await onRegister(email, password);
        } else {
            result = await onLogin(email, password);
        }
        
        setIsLoading(false);
        if (result.success) {
            if (isRegistering) {
                setVerificationSent(true);
            } else {
                handleClose();
            }
        } else {
            setError(result.error || 'Ocurrió un error inesperado');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        // Use setTimeout to allow state update and re-render before focusing
        setTimeout(() => {
            if (passwordInputRef.current) {
                passwordInputRef.current.focus();
                // Move cursor to the end of the text
                const length = passwordInputRef.current.value.length;
                passwordInputRef.current.setSelectionRange(length, length);
            }
        }, 0);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
        setTimeout(() => {
            if (confirmPasswordInputRef.current) {
                confirmPasswordInputRef.current.focus();
                // Move cursor to the end of the text
                const length = confirmPasswordInputRef.current.value.length;
                confirmPasswordInputRef.current.setSelectionRange(length, length);
            }
        }, 0);
    };

    // Success View for Registration
    if (verificationSent) {
        return <VerificationSuccess email={email} onClose={handleClose} />;
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
                
                <ModalHeader 
                    title={isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'} 
                    onClose={handleClose} 
                />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white outline-none transition-all"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>
                    
                    <PasswordInputGroup
                        id="password"
                        label="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showPassword={showPassword}
                        toggleVisibility={togglePasswordVisibility}
                        inputRef={passwordInputRef}
                    />
                    
                    {isRegistering && (
                        <div className="animate-[fadeIn_0.3s_ease-out]">
                            <PasswordInputGroup
                                id="confirmPassword"
                                label="Confirmar Contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                showPassword={showConfirmPassword}
                                toggleVisibility={toggleConfirmPasswordVisibility}
                                inputRef={confirmPasswordInputRef}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            isRegistering ? 'Registrarse' : 'Entrar'
                        )}
                    </button>
                </form>

                <AuthSwitchFooter isRegistering={isRegistering} onToggle={toggleMode} />
            </div>
        </div>
    );
};

export default LoginModal;