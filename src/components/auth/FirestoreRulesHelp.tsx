import React, { useState } from 'react';

export const RECOMMENDED_FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && (
        request.auth.token.email == 'eligioestevez@hotmail.com' ||
        request.auth.token.email == 'eligiomajestic@gmail.com'
      );
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }
  }
}`;

export const FirestoreRulesHelp: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(RECOMMENDED_FIRESTORE_RULES);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="mt-3 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/20 p-3 text-xs">
            <div className="flex items-center justify-between gap-2">
                <span className="text-amber-800 dark:text-amber-300 font-medium">
                    Modo de gestión por correo activo. Puedes autorizar cualquier correo arriba.
                </span>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-400 underline whitespace-nowrap"
                >
                    {isOpen ? 'Ocultar reglas Firebase' : 'Ver reglas Firebase'}
                </button>
            </div>

            {isOpen && (
                <div className="mt-2.5 pt-2.5 border-t border-amber-200 dark:border-amber-800/60 space-y-2">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Para que Firebase permita listar automáticamente todos los documentos de{' '}
                        <code>users</code> desde otros dispositivos, pega estas reglas en tu consola de
                        Firebase (<strong>Firestore Database → Reglas</strong>):
                    </p>
                    <div className="relative">
                        <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-100 text-[10px] font-mono overflow-x-auto">
                            {RECOMMENDED_FIRESTORE_RULES}
                        </pre>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="absolute top-2 right-2 px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold"
                        >
                            {copied ? '¡Copiado!' : 'Copiar Reglas'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirestoreRulesHelp;
