import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { 
    User, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendEmailVerification,
    reload
} from "firebase/auth";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Send verification email immediately after registration
            if (userCredential.user) {
                await sendEmailVerification(userCredential.user);
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
            await signOut(auth);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };
    
    const resendVerificationEmail = async () => {
        if (auth.currentUser && !auth.currentUser.emailVerified) {
            try {
                await sendEmailVerification(auth.currentUser);
                return { success: true };
            } catch (error: any) {
                return { success: false, error: error.message };
            }
        }
        return { success: false, error: "No hay usuario activo o ya está verificado." };
    };

    const reloadUser = async () => {
        if (auth.currentUser) {
            await reload(auth.currentUser);
            // Force state update by setting user to current copy
            setUser({ ...auth.currentUser } as User);
            return auth.currentUser;
        }
        return null;
    };

    return { user, loading, login, register, logout, resendVerificationEmail, reloadUser };
};
