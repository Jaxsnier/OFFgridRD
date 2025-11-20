import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import firebase from 'firebase/app';
import 'firebase/auth';

export const useAuth = () => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            return { success: true };
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            let errorMessage = "Error al iniciar sesión.";
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "Correo o contraseña incorrectos.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Demasiados intentos fallidos. Intente más tarde.";
            }
            return { success: false, error: errorMessage };
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Send verification email immediately after registration
            if (userCredential.user) {
                await userCredential.user.sendEmailVerification();
            }
            
            return { success: true };
        } catch (error: any) {
            console.error("Error al registrarse:", error);
            let errorMessage = "Error al registrarse.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "El correo electrónico ya está en uso.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "La contraseña debe tener al menos 6 caracteres.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Correo electrónico inválido.";
            }
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };
    
    const resendVerificationEmail = async () => {
        if (auth.currentUser && !auth.currentUser.emailVerified) {
            try {
                await auth.currentUser.sendEmailVerification();
                return { success: true };
            } catch (error: any) {
                return { success: false, error: error.message };
            }
        }
        return { success: false, error: "No hay usuario activo o ya está verificado." };
    };

    const reloadUser = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload();
            // Force state update by creating a shallow copy or resetting
            // Note: user state might update automatically via onAuthStateChanged or we might need to manually trigger if strict equality check prevents update
            if (auth.currentUser) {
                 // We spread to create a new reference, though firebase user objects are mutable.
                 // Ideally onAuthStateChanged handles this, but force update helps in UI
                 // Since we don't have a clone method easily available for User, we rely on React state update.
                 // However, setUser({...auth.currentUser} as any) is risky.
                 // Let's just rely on fetching current user.
                 setUser(auth.currentUser);
            }
            return auth.currentUser;
        }
        return null;
    };

    return { user, loading, login, register, logout, resendVerificationEmail, reloadUser };
};
