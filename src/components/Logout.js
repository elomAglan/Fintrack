// src/pages/Logout.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig'; // Assurez-vous que le chemin est correct
import { signOut } from 'firebase/auth';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await signOut(auth); // Déconnexion de Firebase
                console.log('Déconnexion réussie');
                navigate('/login'); // Redirige vers la page de connexion après déconnexion
            } catch (error) {
                console.error('Erreur lors de la déconnexion', error);
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="p-4">
            <h1 className="text-2xl">Déconnexion en cours...</h1>
        </div>
    );
};

export default Logout;
