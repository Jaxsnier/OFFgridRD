export type UserRole = 'admin' | 'vendedor' | 'visitante';

export const ADMIN_EMAILS: string[] = [
    'eligioestevez@hotmail.com',
    'eligiomajestic@gmail.com'
];

export const ROLE_LABELS: Record<UserRole, string> = {
    admin: 'Administrador',
    vendedor: 'Vendedor',
    visitante: 'Visitante'
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    admin: 'Acceso total a Cotización, Base de Datos y configuración.',
    vendedor: 'Acceso a Cotización habilitado. Sin acceso a Base de Datos.',
    visitante: 'Acceso público (Inicio, Calculadora, Nosotros). Sin acceso a Cotización ni Base de Datos.'
};

export const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
    admin: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700',
    vendedor: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    visitante: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
};

export const isDefaultAdminEmail = (email?: string | null): boolean => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

/**
 * Permisos por rol:
 * - admin: accede a todo
 * - vendedor: solo se le limita el acceso a Base de Datos ('potenciales')
 * - visitante: se le limita el acceso a Cotización ('cotizacion') y Base de Datos ('potenciales')
 */
export const canAccessView = (role: UserRole, view: string): boolean => {
    if (role === 'admin') {
        return true;
    }
    if (role === 'vendedor') {
        return view !== 'potenciales';
    }
    // visitante
    return view !== 'cotizacion' && view !== 'potenciales';
};
