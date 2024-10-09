// src/pages/SignUp.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fonction pour gérer l'inscription par email et mot de passe
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/dashboard'); // Rediriger après l'inscription réussie
        } catch (error) {
            setError("Erreur lors de l'inscription. Veuillez réessayer.");
            console.error(error);
        }
    };

    // Fonction pour gérer l'inscription par Google
    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/dashboard');
        } catch (error) {
            setError("Erreur lors de l'inscription avec Google. Veuillez réessayer.");
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>
                <form onSubmit={handleSignUp}>
                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Mot de passe" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    >
                        S'inscrire
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button 
                        onClick={handleGoogleSignUp} 
                        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                    >
                        S'inscrire avec Google
                    </button>
                </div>
                <p className="mt-4 text-center">
                    J'ai déjà un compte? <a href="/login" className="text-blue-500 hover:underline">Se connecter</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
