import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabase/Supabase"
import toast from "react-hot-toast";

const AuthContext = createContext<any>({});

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);

    const signUpNewUser = async (email: string, password: any) => {
        const { data, error } = await supabase.functions.invoke("create-user", {
            body: {
                email: email.toLowerCase(),
                password: password,
            }
        })

        if (error) {
            console.error("Error signing up: ", error);
            return { success: false, error };
        };

        return { success: true, data }; 
    };

    const signInUser = async (email: string, password: any) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.toLowerCase(),
                password: password
            });

            if (error) {
                console.error("Error signing in: ", error);
                toast.error("Error al iniciar sesión. Por favor, verifica tus credenciales.");
                return { success: false, error };
            }

            return { success: true, data };
        } catch (error) {
            console.error("Unexpected error during sign in: ", error);
            return { success: false, error };
        }
    };

    const deleteUser = async (uid: string) => {
        const { error } = await supabase.functions.invoke("delete-user", {
            method: "DELETE",
            body: {
                userId: uid,
            }
        });

        if (error) {
            console.error("Error deleting user: ", error);
            return { success: false, error };
        }

        return { success: true };
    }

    const recoverPassword = async (email: string) => {
        const { error } = await supabase.functions.invoke("send-password-recovery-email", {
            body: {
                email: email.toLowerCase(),
            }
        })

        if (error) {
            return { success: false, error };
        }

        return { success: true };
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        console.log("Signing out...");

        if (error) {
            console.error("Error signing out: ", error);
            return { success: false, error };
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <AuthContext.Provider
            value = {{ signUpNewUser, signInUser, signOut, deleteUser, recoverPassword, session }}
        >
            { children }
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};