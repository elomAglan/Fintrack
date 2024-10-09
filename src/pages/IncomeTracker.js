// src/pages/Incomes.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';

const Incomes = () => {
    const navigate = useNavigate();
    const [incomes, setIncomes] = useState([]);
    const [income, setIncome] = useState({ amount: '', source: '', description: '', date: '', frequency: 'mois' });

    // Charger les revenus depuis l'API
    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const response = await fetch('http://localhost:5000/incomes'); // Remplacez par votre API
                if (!response.ok) throw new Error('Erreur lors de la récupération des revenus');
                const data = await response.json();
                setIncomes(data);
            } catch (error) {
                console.error('Erreur lors du chargement des revenus :', error);
            }
        };
        fetchIncomes();
    }, []);

    // Ajouter un revenu dans PostgreSQL
    const handleAddIncome = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/incomes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(income),
            });
            if (!response.ok) throw new Error('Erreur lors de l\'ajout du revenu');
            const newIncome = await response.json(); // Récupérer le nouveau revenu
            setIncomes([...incomes, newIncome]); // Mettre à jour l'état local
            setIncome({ amount: '', source: '', description: '', date: '', frequency: 'mois' }); // Réinitialiser le formulaire
        } catch (error) {
            console.error('Erreur lors de l\'ajout du revenu :', error);
        }
    };

    // Supprimer un revenu de PostgreSQL
    const handleDeleteIncome = async (id) => {
        try {
            await fetch(`http://localhost:5000/incomes/${id}`, {
                method: 'DELETE',
            });
            setIncomes(incomes.filter((income) => income.id !== id)); // Mettre à jour l'état local
        } catch (error) {
            console.error('Erreur lors de la suppression du revenu :', error);
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
                    <FaArrowLeft className="mr-2" /> Retour
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-4">Suivi des Revenus</h2>

            {/* Formulaire d'ajout de revenu */}
            <form onSubmit={handleAddIncome} className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 font-bold">Montant</label>
                        <input
                            type="number"
                            value={income.amount}
                            onChange={(e) => setIncome({ ...income, amount: e.target.value })}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold">Source</label>
                        <input
                            type="text"
                            value={income.source}
                            onChange={(e) => setIncome({ ...income, source: e.target.value })}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold">Description</label>
                        <input
                            type="text"
                            value={income.description}
                            onChange={(e) => setIncome({ ...income, description: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold">Date</label>
                        <input
                            type="date"
                            value={income.date}
                            onChange={(e) => setIncome({ ...income, date: e.target.value })}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold">Fréquence</label>
                        <select
                            value={income.frequency}
                            onChange={(e) => setIncome({ ...income, frequency: e.target.value })}
                            required
                            className="w-full p-2 border rounded"
                        >
                            <option value="mois">Mensuel</option>
                            <option value="semaine">Hebdomadaire</option>
                            <option value="jour">Quotidien</option>
                        </select>
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                >
                    <FaPlus className="inline mr-2" /> Ajouter un revenu
                </button>
            </form>

            {/* Liste des revenus récents */}
            <h3 className="text-xl font-bold mb-4">Revenus récents</h3>
            <ul className="space-y-2">
                {incomes.map((income) => (
                    <li key={income.id} className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between">
                        <div>
                            <span>{income.description || 'Revenu sans description'}</span>
                            <div className="text-gray-500 text-sm">{income.date}</div>
                        </div>
                        <span>{income.amount} € - {income.source} ({income.frequency})</span>
                        <button
                            onClick={() => handleDeleteIncome(income.id)}
                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-300 ml-4"
                        >
                            Supprimer
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Incomes;
