import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios'; // Importer Axios pour les requêtes HTTP

const BudgetCreation = () => {
    const navigate = useNavigate();
    const [budgets, setBudgets] = useState([]);
    const [budgetName, setBudgetName] = useState('');
    const [amount, setAmount] = useState('');
    const [period, setPeriod] = useState('Mensuel');

    // Charger les budgets de l'API au démarrage
    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await axios.get('/api/budgets'); // Remplacez par l'URL de votre API
                setBudgets(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des budgets :", error);
            }
        };
        fetchBudgets();
    }, []);

    // Fonction pour ajouter un nouveau budget dans PostgreSQL
    const handleAddBudget = async (e) => {
        e.preventDefault();

        const newBudget = {
            name: budgetName,
            amount: parseFloat(amount),
            period: period,
        };

        try {
            const response = await axios.post('/api/budgets', newBudget); // Remplacez par l'URL de votre API
            setBudgets([...budgets, response.data]);
            setBudgetName('');
            setAmount('');
            setPeriod('Mensuel');
        } catch (error) {
            console.error("Erreur lors de l'ajout du budget :", error);
        }
    };

    // Fonction pour supprimer un budget
    const handleDeleteBudget = async (id) => {
        try {
            await axios.delete(`/api/budgets/${id}`); // Remplacez par l'URL de votre API
            setBudgets(budgets.filter(budget => budget.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression du budget :", error);
        }
    };

    return (
        <div className="container mx-auto p-4 pt-24">
            {/* Bouton de retour */}
            <div className="mb-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-500 hover:text-blue-700"
                >
                    <FaArrowLeft className="mr-2" />
                    Retour
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-4">Création de Budgets</h2>

            {/* Formulaire de création de budget */}
            <form onSubmit={handleAddBudget} className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <div className="mb-4">
                    <label className="block font-semibold mb-2" htmlFor="budgetName">Nom du Budget :</label>
                    <input
                        type="text"
                        id="budgetName"
                        name="budgetName"
                        value={budgetName}
                        onChange={(e) => setBudgetName(e.target.value)}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold mb-2" htmlFor="amount">Montant :</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold mb-2" htmlFor="period">Période :</label>
                    <select
                        id="period"
                        name="period"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="border rounded p-2 w-full"
                    >
                        <option value="Mensuel">Mensuel</option>
                        <option value="Annuel">Annuel</option>
                        <option value="Hebdomadaire">Hebdomadaire</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                >
                    Ajouter le Budget
                </button>
            </form>

            {/* Liste des budgets créés */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Budgets Actuels</h3>
                {budgets.length === 0 ? (
                    <p>Aucun budget créé.</p>
                ) : (
                    <ul>
                        {budgets.map(budget => (
                            <li key={budget.id} className="mb-4 flex justify-between items-center">
                                <div>
                                    <strong>{budget.name}</strong> - ${budget.amount.toFixed(2)} ({budget.period})
                                </div>
                                <button
                                    onClick={() => handleDeleteBudget(budget.id)}
                                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-300"
                                >
                                    Supprimer
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default BudgetCreation;
