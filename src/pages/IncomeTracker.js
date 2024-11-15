import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebaseConfig'; // Assurez-vous que le chemin est correct
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const IncomeTracker = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [incomesList, setIncomesList] = useState([]); // Etat pour stocker la liste des revenus
    const user = auth.currentUser; // Récupérer l'utilisateur connecté

    useEffect(() => {
        const fetchIncomes = async () => {
            if (!user) return; // Si aucun utilisateur n'est connecté, ne rien faire

            try {
                // Récupérer les revenus de l'utilisateur depuis Firestore
                const incomesCollection = collection(db, 'incomes');
                const incomesQuery = query(incomesCollection, where('userId', '==', user.uid));
                const incomesSnapshot = await getDocs(incomesQuery);
                const incomes = incomesSnapshot.docs.map(doc => doc.data());
                setIncomesList(incomes);
            } catch (error) {
                console.error('Erreur lors de la récupération des revenus:', error);
            }
        };

        fetchIncomes();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Vous devez être connecté pour ajouter un revenu.');
            return;
        }

        // Validation des champs
        if (!amount || !description || !category) {
            alert('Tous les champs sont obligatoires.');
            return;
        }

        setLoading(true);

        try {
            // Ajouter un revenu dans Firestore
            const incomesCollection = collection(db, 'incomes');
            await addDoc(incomesCollection, {
                amount: parseFloat(amount),
                description,
                category,
                userId: user.uid,
                createdAt: new Date(),
            });

            // Réinitialiser le formulaire après l'ajout
            setAmount('');
            setDescription('');
            setCategory('');

            // Recharger la liste des revenus après l'ajout
            const incomesQuery = query(incomesCollection, where('userId', '==', user.uid));
            const incomesSnapshot = await getDocs(incomesQuery);
            const incomes = incomesSnapshot.docs.map(doc => doc.data());
            setIncomesList(incomes);

            alert('Revenu ajouté avec succès.');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du revenu:', error);
            alert('Une erreur est survenue lors de l\'ajout du revenu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-4 text-center">Suivi des Revenus</h2>

            {/* Formulaire d'ajout de revenu */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Ajouter un revenu</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block font-medium mb-2">Montant</label>
                        <input
                            type="number"
                            id="amount"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Montant du revenu"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block font-medium mb-2">Description</label>
                        <input
                            type="text"
                            id="description"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description du revenu"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block font-medium mb-2">Catégorie</label>
                        <select
                            id="category"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner une catégorie</option>
                            <option value="Salaires">Salaires</option>
                            <option value="Investissements">Investissements</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-500 text-white rounded-lg"
                        disabled={loading}
                    >
                        {loading ? 'Ajout en cours...' : 'Ajouter un revenu'}
                    </button>
                </form>
            </div>

            {/* Liste des revenus */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Liste des Revenus</h3>
                <div className="space-y-4">
                    {incomesList.length === 0 ? (
                        <p>Aucun revenu ajouté.</p>
                    ) : (
                        incomesList.map((income, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium">Montant : ${income.amount}</p>
                                        <p className="text-sm text-gray-600">Catégorie : {income.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{new Date(income.createdAt.seconds * 1000).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700">{income.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncomeTracker;
