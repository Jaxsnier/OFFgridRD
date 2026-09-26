import React, { useEffect, useState } from 'react';
import { UserRole, ROLE_LABELS, ROLE_BADGE_CLASSES, isDefaultAdminEmail } from './rolesConfig';
import {
    ManagedUserItem,
    loadAllManagedUsers,
    persistUserRoleAssignment
} from './roleStorageService';
import FirestoreRulesHelp from './FirestoreRulesHelp';

interface AdminUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUserUid?: string;
    currentUserEmail?: string | null;
}

export const AdminUsersModal: React.FC<AdminUsersModalProps> = ({
    isOpen,
    onClose,
    currentUserUid,
    currentUserEmail
}) => {
    const [users, setUsers] = useState<ManagedUserItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);
    const [fullCollectionAllowed, setFullCollectionAllowed] = useState(true);

    // Form to add/authorize an email directly
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState<UserRole>('vendedor');
    const [formMessage, setFormMessage] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const result = await loadAllManagedUsers(currentUserUid, currentUserEmail);
            setUsers(result.users);
            setFullCollectionAllowed(result.fullCollectionAllowed);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            setFormMessage(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleRoleChange = async (target: ManagedUserItem, roleToSet: UserRole) => {
        setUpdatingEmail(target.email);
        setFormMessage(null);
        try {
            await persistUserRoleAssignment(
                target.email,
                target.uid,
                roleToSet,
                currentUserUid
            );
            setUsers((prev) =>
                prev.map((u) =>
                    u.email === target.email
                        ? { ...u, role: isDefaultAdminEmail(u.email) ? 'admin' : roleToSet }
                        : u
                )
            );
        } finally {
            setUpdatingEmail(null);
        }
    };

    const handleAddEmailRole = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanEmail = newEmail.trim().toLowerCase();
        if (!cleanEmail || !cleanEmail.includes('@')) return;

        const assignedRole: UserRole = isDefaultAdminEmail(cleanEmail) ? 'admin' : newRole;
        setUpdatingEmail(cleanEmail);
        try {
            await persistUserRoleAssignment(
                cleanEmail,
                `email:${cleanEmail}`,
                assignedRole,
                currentUserUid
            );
            setUsers((prev) => {
                const exists = prev.some((u) => u.email === cleanEmail);
                if (exists) {
                    return prev.map((u) =>
                        u.email === cleanEmail ? { ...u, role: assignedRole } : u
                    );
                }
                return [
                    ...prev,
                    {
                        uid: `email:${cleanEmail}`,
                        email: cleanEmail,
                        role: assignedRole,
                        source: 'managed'
                    }
                ];
            });
            setNewEmail('');
            setFormMessage(`Rol "${ROLE_LABELS[assignedRole]}" asignado a ${cleanEmail}`);
        } finally {
            setUpdatingEmail(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl p-6 overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                            Control de Roles de Usuarios (RBAC)
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Asigna permisos de Visitante, Vendedor o Administrador por correo electrónico
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
                    >
                        ✕
                    </button>
                </div>

                {/* Role Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                        <strong className="text-purple-700 dark:text-purple-300 block">Administrador</strong>
                        <span className="text-slate-600 dark:text-slate-400">Acceso total (Cotización + Base de Datos)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                        <strong className="text-emerald-700 dark:text-emerald-300 block">Vendedor</strong>
                        <span className="text-slate-600 dark:text-slate-400">Acceso a Cotización (Sin Base de Datos)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
                        <strong className="text-slate-700 dark:text-slate-200 block">Visitante</strong>
                        <span className="text-slate-600 dark:text-slate-400">Sin Cotización ni Base de Datos</span>
                    </div>
                </div>

                {/* Add / Authorize Email Form */}
                <form
                    onSubmit={handleAddEmailRole}
                    className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600"
                >
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                        Autorizar o cambiar rol por correo electrónico:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as UserRole)}
                            className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                        >
                            <option value="vendedor">Vendedor</option>
                            <option value="admin">Administrador</option>
                            <option value="visitante">Visitante</option>
                        </select>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
                        >
                            Guardar Rol
                        </button>
                    </div>
                    {formMessage && (
                        <p className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            ✓ {formMessage}
                        </p>
                    )}
                </form>

                {/* Users List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl">
                    {loading ? (
                        <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                            Cargando usuarios y permisos...
                        </div>
                    ) : (
                        users.map((u) => {
                            const isProtectedAdmin = isDefaultAdminEmail(u.email);
                            const isSelf =
                                (currentUserEmail &&
                                    u.email.toLowerCase() === currentUserEmail.toLowerCase()) ||
                                u.uid === currentUserUid;

                            return (
                                <div
                                    key={u.email}
                                    className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-slate-800"
                                >
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                            {u.email}{' '}
                                            {isSelf && (
                                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">
                                                    (Tú)
                                                </span>
                                            )}
                                            {isProtectedAdmin && (
                                                <span className="ml-1.5 text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                                                    • Principal
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${ROLE_BADGE_CLASSES[u.role]}`}
                                        >
                                            {ROLE_LABELS[u.role]}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {(['visitante', 'vendedor', 'admin'] as UserRole[]).map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                disabled={
                                                    updatingEmail === u.email ||
                                                    (isProtectedAdmin && r !== 'admin')
                                                }
                                                onClick={() => handleRoleChange(u, r)}
                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                                                    u.role === r
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                                            >
                                                {ROLE_LABELS[r]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {!fullCollectionAllowed && <FirestoreRulesHelp />}

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersModal;
