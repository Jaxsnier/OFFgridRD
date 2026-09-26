import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { UserRole, ROLE_LABELS, ROLE_BADGE_CLASSES, isDefaultAdminEmail } from './rolesConfig';

interface UserRecord {
    uid: string;
    email: string;
    role: UserRole;
}

interface AdminUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUserUid?: string;
}

export const AdminUsersModal: React.FC<AdminUsersModalProps> = ({
    isOpen,
    onClose,
    currentUserUid
}) => {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingUid, setUpdatingUid] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const snap = await getDocs(collection(db, 'users'));
            const list: UserRecord[] = [];
            snap.forEach((docSnap) => {
                const data = docSnap.data();
                const email = data.email || 'Sin correo registrado';
                const resolvedRole: UserRole = isDefaultAdminEmail(email)
                    ? 'admin'
                    : (data.role as UserRole) || 'visitante';
                list.push({
                    uid: docSnap.id,
                    email,
                    role: resolvedRole
                });
            });
            setUsers(list);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setErrorMsg('No se pudo cargar la lista de usuarios desde Firestore.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleRoleChange = async (targetUid: string, newRole: UserRole) => {
        setUpdatingUid(targetUid);
        setErrorMsg(null);
        try {
            const userRef = doc(db, 'users', targetUid);
            await updateDoc(userRef, { role: newRole });
            setUsers((prev) =>
                prev.map((u) => (u.uid === targetUid ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            console.error('Error al actualizar rol:', err);
            setErrorMsg('Error al guardar el nuevo rol en Firestore.');
        } finally {
            setUpdatingUid(null);
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
                            Asigna permisos de Visitante, Vendedor o Administrador
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

                {errorMsg && (
                    <div className="mb-3 p-2.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium">
                        {errorMsg}
                    </div>
                )}

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl">
                    {loading ? (
                        <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                            Cargando usuarios registrados...
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                            No se encontraron usuarios registrados en la colección.
                        </div>
                    ) : (
                        users.map((u) => {
                            const isProtectedAdmin = isDefaultAdminEmail(u.email);
                            return (
                                <div
                                    key={u.uid}
                                    className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-slate-800"
                                >
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                            {u.email}{' '}
                                            {u.uid === currentUserUid && (
                                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">
                                                    (Tú)
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
                                                disabled={updatingUid === u.uid || (isProtectedAdmin && r !== 'admin')}
                                                onClick={() => handleRoleChange(u.uid, r)}
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
