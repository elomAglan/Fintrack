import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importer Link pour la navigation
import { FaArrowLeft } from 'react-icons/fa'; // Importer l'icône de retour

const Profile = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser
            ? JSON.parse(savedUser)
            : {
                  name: "John Doe",
                  email: "john.doe@example.com",
                  joinedDate: "1er Janvier 2023",
                  balance: 2500.0,
              };
    });

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        joinedDate: user.joinedDate,
        balance: user.balance,
    });

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUser({ ...user, ...formData });
        setEditMode(false);
    };

    return (
        <div className="container mx-auto p-4">
            {/* Bouton de retour */}
            <div className="mb-4">
                <Link to="/" className="flex items-center text-blue-500 hover:text-blue-700">
                    <FaArrowLeft className="mr-2" /> {/* Icône de retour */}
                    Retour
                </Link>
            </div>

            {/* Titre du profil */}
            <h2 className="text-2xl font-bold mb-4">Profil utilisateur</h2>

            <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Informations personnelles</h3>

                {!editMode ? (
                    <div>
                        <div className="mb-4">
                            <strong>Nom :</strong> <span>{user.name}</span>
                        </div>
                        <div className="mb-4">
                            <strong>Email :</strong> <span>{user.email}</span>
                        </div>
                        <div className="mb-4">
                            <strong>Date d'inscription :</strong> <span>{user.joinedDate}</span>
                        </div>
                        <div className="mb-4">
                            <strong>Solde actuel :</strong> <span>${user.balance.toFixed(2)}</span>
                        </div>

                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                            onClick={() => setEditMode(true)}
                        >
                            Modifier le profil
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2" htmlFor="name">
                                Nom :
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2" htmlFor="email">
                                Email :
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2" htmlFor="joinedDate">
                                Date d'inscription :
                            </label>
                            <input
                                type="text"
                                id="joinedDate"
                                name="joinedDate"
                                value={formData.joinedDate}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2" htmlFor="balance">
                                Solde actuel :
                            </label>
                            <input
                                type="number"
                                id="balance"
                                name="balance"
                                value={formData.balance}
                                onChange={handleInputChange}
                                className="border rounded p-2 w-full"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                        >
                            Sauvegarder
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 text-white py-2 px-4 rounded ml-4 hover:bg-red-700 transition duration-300"
                            onClick={() => setEditMode(false)}
                        >
                            Annuler
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
