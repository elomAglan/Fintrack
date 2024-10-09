import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../config/firebaseConfig'; // Importez Firebase si vous gérez l'authentification avec Firebase

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Ajouter un listener d'état d'authentification Firebase
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe(); // Nettoyage du listener
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};
