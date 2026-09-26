import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { ADMIN_EMAILS, UserRole, isDefaultAdminEmail } from './rolesConfig';

const LOCAL_STORAGE_ROLES_KEY = 'offgrid_rbac_roles_by_email_v1';

export interface ManagedUserItem {
    uid: string;
    email: string;
    role: UserRole;
    source?: 'default_admin' | 'firestore' | 'managed';
}

export const getLocalEmailRoles = (): Record<string, UserRole> => {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_ROLES_KEY);
        if (!raw) return {};
        return JSON.parse(raw) as Record<string, UserRole>;
    } catch {
        return {};
    }
};

export const saveLocalEmailRoles = (rolesMap: Record<string, UserRole>): void => {
    try {
        localStorage.setItem(LOCAL_STORAGE_ROLES_KEY, JSON.stringify(rolesMap));
    } catch {
        // Ignore storage quota errors
    }
};

export const resolveRoleByEmail = (
    email?: string | null,
    firestoreRole?: UserRole
): UserRole => {
    if (!email) return 'visitante';
    const normalized = email.trim().toLowerCase();

    if (isDefaultAdminEmail(normalized)) {
        return 'admin';
    }

    const localMap = getLocalEmailRoles();
    if (localMap[normalized]) {
        return localMap[normalized];
    }

    if (
        firestoreRole === 'admin' ||
        firestoreRole === 'vendedor' ||
        firestoreRole === 'visitante'
    ) {
        return firestoreRole;
    }

    return 'visitante';
};

export const loadAllManagedUsers = async (
    currentUserUid?: string,
    currentUserEmail?: string | null
): Promise<{ users: ManagedUserItem[]; fullCollectionAllowed: boolean }> => {
    const byEmail = new Map<string, ManagedUserItem>();

    // 1. Seed default admins first
    ADMIN_EMAILS.forEach((adminEmail) => {
        const norm = adminEmail.trim().toLowerCase();
        byEmail.set(norm, {
            uid: `admin:${norm}`,
            email: norm,
            role: 'admin',
            source: 'default_admin'
        });
    });

    // 2. Load from localStorage
    const localMap = getLocalEmailRoles();
    Object.entries(localMap).forEach(([emailKey, roleVal]) => {
        const norm = emailKey.trim().toLowerCase();
        byEmail.set(norm, {
            uid: byEmail.get(norm)?.uid || `email:${norm}`,
            email: norm,
            role: isDefaultAdminEmail(norm) ? 'admin' : roleVal,
            source: 'managed'
        });
    });

    // 3. Load from current admin user's own Firestore document (always allowed by per-user rules)
    if (currentUserUid) {
        try {
            const selfSnap = await getDoc(doc(db, 'users', currentUserUid));
            if (selfSnap.exists()) {
                const selfData = selfSnap.data();
                const cloudManagedRoles = (selfData?.managedRoles || {}) as Record<
                    string,
                    UserRole
                >;
                const mergedMap: Record<string, UserRole> = { ...localMap };

                Object.entries(cloudManagedRoles).forEach(([emailKey, roleVal]) => {
                    const norm = emailKey.trim().toLowerCase();
                    const finalRole: UserRole = isDefaultAdminEmail(norm) ? 'admin' : roleVal;
                    mergedMap[norm] = finalRole;
                    byEmail.set(norm, {
                        uid: byEmail.get(norm)?.uid || `email:${norm}`,
                        email: norm,
                        role: finalRole,
                        source: 'managed'
                    });
                });

                saveLocalEmailRoles(mergedMap);
            }
        } catch {
            // Ignore if offline or restricted
        }
    }

    // Ensure current logged-in user is in the list
    if (currentUserEmail) {
        const normCurrent = currentUserEmail.trim().toLowerCase();
        const existing = byEmail.get(normCurrent);
        byEmail.set(normCurrent, {
            uid: currentUserUid || existing?.uid || `email:${normCurrent}`,
            email: normCurrent,
            role: isDefaultAdminEmail(normCurrent)
                ? 'admin'
                : existing?.role || 'visitante',
            source: existing?.source || 'firestore'
        });
    }

    // 4. Try loading full Firestore 'users' collection if security rules allow collection queries
    let fullCollectionAllowed = false;
    try {
        const snap = await getDocs(collection(db, 'users'));
        fullCollectionAllowed = true;
        snap.forEach((docSnap) => {
            const data = docSnap.data();
            const rawEmail = (data?.email || '').trim().toLowerCase();
            if (!rawEmail) return;
            const existing = byEmail.get(rawEmail);
            const resolvedRole: UserRole = isDefaultAdminEmail(rawEmail)
                ? 'admin'
                : existing?.source === 'managed'
                ? existing.role
                : (data?.role as UserRole) || 'visitante';

            byEmail.set(rawEmail, {
                uid: docSnap.id,
                email: rawEmail,
                role: resolvedRole,
                source: 'firestore'
            });
        });
    } catch {
        fullCollectionAllowed = false;
    }

    return {
        users: Array.from(byEmail.values()),
        fullCollectionAllowed
    };
};

export const persistUserRoleAssignment = async (
    targetEmail: string,
    targetUid: string | undefined,
    newRole: UserRole,
    currentUserUid?: string
): Promise<void> => {
    const normEmail = targetEmail.trim().toLowerCase();
    const finalRole: UserRole = isDefaultAdminEmail(normEmail) ? 'admin' : newRole;

    // 1. Update local map
    const localMap = getLocalEmailRoles();
    localMap[normEmail] = finalRole;
    saveLocalEmailRoles(localMap);

    // 2. Save in current admin's own Firestore document (allowed by userId == request.auth.uid rules)
    if (currentUserUid) {
        try {
            await setDoc(
                doc(db, 'users', currentUserUid),
                { managedRoles: localMap },
                { merge: true }
            );
        } catch {
            // Ignore if restricted
        }
    }

    // 3. Also attempt to update target user's Firestore document if it has a real UID
    if (
        targetUid &&
        !targetUid.startsWith('email:') &&
        !targetUid.startsWith('admin:')
    ) {
        try {
            await setDoc(
                doc(db, 'users', targetUid),
                { email: normEmail, role: finalRole },
                { merge: true }
            );
        } catch {
            // Ignore if cross-user write is blocked by Firestore rules
        }
    }
};
