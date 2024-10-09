import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebaseConfig'; // Assurez-vous d'importer la configuration Firebase
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Pour la redirection

const AddDebt = () => {
    const navigate = useNavigate(); // Pour la navigation
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [debts, setDebts] = useState([]);

    // Vérifiez si l'utilisateur est connecté
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setMessage('Vous devez être connecté pour accéder à cette page.');
            // Rediriger l'utilisateur vers la page de connexion (ou une autre page)
            navigate('/login'); // Changez cela pour l'URL de votre page de connexion
        } else {
            fetchDebts(); // Si l'utilisateur est connecté, récupérez les dettes
        }
    }, [navigate]);

    const handleAddDebt = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser; // Obtenir l'utilisateur connecté
            if (user) {
                await addDoc(collection(db, 'debts'), {
                    title,
                    amount: Number(amount),
                    dueDate: new Date(dueDate),
                    description,
                    isPaid: false,
                    userId: user.uid,
                });
                setMessage('La dette a été ajoutée avec succès');
                setTitle('');
                setAmount('');
                setDueDate('');
                setDescription('');
                fetchDebts();
            } else {
                setMessage('Vous devez être connecté pour ajouter une dette.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la dette : ', error);
            setMessage('Erreur lors de l\'ajout de la dette');
        }
    };

    const fetchDebts = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const debtsQuery = query(collection(db, 'debts'), where('userId', '==', user.uid));
                const debtsCollection = await getDocs(debtsQuery);
                const debtsList = debtsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setDebts(debtsList);
            } catch (error) {
                console.error('Erreur lors de la récupération des dettes : ', error);
            }
        }
    };

    const handleDeleteDebt = async (id) => {
        try {
            await deleteDoc(doc(db, 'debts', id));
            setMessage('La dette a été supprimée avec succès');
            fetchDebts();
        } catch (error) {
            console.error('Erreur lors de la suppression de la dette : ', error);
            setMessage('Erreur lors de la suppression de la dette');
        }
    };

    return (
        <div className="container mx-auto p-4 pt-24">
            <h2 className="text-2xl font-bold mb-6">Ajouter une nouvelle dette</h2>

            {/* Afficher le message d'erreur si l'utilisateur n'est pas connecté */}
            {message && (
                <p className={`mt-4 text-sm ${message.includes('succès') ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                </p>
            )}

            {/* Formulaire d'ajout de dettes */}
            {auth.currentUser && (
                <form onSubmit={handleAddDebt} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Titre</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Titre de la dette"
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Montant</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Montant de la dette"
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date d'échéance</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description optionnelle de la dette"
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Ajouter une dette
                    </button>
                </form>
            )}

            {/* Liste des dettes */}
            <h3 className="text-xl font-bold mt-10 mb-4">Liste des dettes</h3>
            {debts.length === 0 ? (
                <p>Aucune dette n'a été ajoutée.</p>
            ) : (
                <ul className="space-y-4">
                    {debts.map((debt) => (
                        <li key={debt.id} className="p-4 bg-gray-100 rounded-md shadow flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-lg">{debt.title}</h4>
                                <p>Montant : {debt.amount} €</p>
                                <p>Date d'échéance : {debt.dueDate.toDate().toLocaleDateString()}</p>
                                <p>Description : {debt.description || 'Aucune description'}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteDebt(debt.id)}
                                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300"
                            >
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddDebt;
