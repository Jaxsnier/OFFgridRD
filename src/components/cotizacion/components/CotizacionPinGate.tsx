import React, { useState } from 'react';

export const COTIZACION_ACCESS_PIN = '1313';

interface CotizacionPinGateProps {
    onUnlock: () => void;
}

export const CotizacionPinGate: React.FC<CotizacionPinGateProps> = ({ onUnlock }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const verifyPin = (value: string) => {
        if (value === COTIZACION_ACCESS_PIN) {
            setError(false);
            onUnlock();
        } else {
            setError(true);
            setPin('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 4);
        setPin(digitsOnly);
        if (error) setError(false);

        if (digitsOnly.length === 4) {
            if (digitsOnly === COTIZACION_ACCESS_PIN) {
                onUnlock();
            } else {
                setError(true);
                setTimeout(() => setPin(''), 350);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        verifyPin(pin);
    };

    return (
        <div className="min-h-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Acceso Restringido
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
                    Ingresa la contraseña de 4 dígitos para entrar al Cotizador y Presupuesto Interno.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={4}
                            autoFocus
                            value={pin}
                            onChange={handleChange}
                            placeholder="••••"
                            className={`w-48 mx-auto block text-center text-3xl font-mono font-black tracking-[0.5em] py-3 px-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none transition ${
                                error
                                    ? 'border-red-500 focus:border-red-500 bg-red-50/30 dark:bg-red-950/20'
                                    : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 dark:focus:border-blue-400'
                            }`}
                        />
                        {error && (
                            <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-2">
                                Contraseña incorrecta. Inténtalo de nuevo.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={pin.length < 4}
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition"
                    >
                        Desbloquear Cotizador
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CotizacionPinGate;
