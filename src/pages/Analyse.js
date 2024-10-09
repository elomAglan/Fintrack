import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebaseConfig'; // Importer Firestore et Firebase Authentication
import { collection, getDocs, query, where } from 'firebase/firestore';

// Configurer les composants de base de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TendanceAnalyse = () => {
    const navigate = useNavigate(); // Initialiser le hook
    const [expenseData, setExpenseData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [dates, setDates] = useState([]);
    const user = auth.currentUser; // Utilisateur connecté

    // Récupérer les données de Firestore
    useEffect(() => {
        if (user) {
            const fetchTransactions = async () => {
                try {
                    // Requête pour les dépenses
                    const expenseQuery = query(collection(db, 'expenses'), where('userId', '==', user.uid));
                    const expenseSnapshot = await getDocs(expenseQuery);
                    const expenses = expenseSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

                    // Requête pour les revenus
                    const incomeQuery = query(collection(db, 'incomes'), where('userId', '==', user.uid));
                    const incomeSnapshot = await getDocs(incomeQuery);
                    const incomes = incomeSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

                    // Combiner les dates des transactions de revenus et dépenses
                    const transactionDates = [
                        ...expenses.map(expense => expense.date),
                        ...incomes.map(income => income.date),
                    ];

                    // Trier les dates dans l'ordre croissant
                    transactionDates.sort((a, b) => new Date(a) - new Date(b));

                    // Mettre à jour les données des graphiques
                    setExpenseData(expenses.map(expense => expense.amount));
                    setIncomeData(incomes.map(income => income.amount));
                    setDates(transactionDates);
                } catch (error) {
                    console.error('Erreur lors du chargement des données :', error);
                }
            };

            fetchTransactions();
        } else {
            navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        }
    }, [user, navigate]);

    // Données pour le graphique
    const data = {
        labels: dates, // Les dates des transactions
        datasets: [
            {
                label: 'Dépenses',
                data: expenseData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
            {
                label: 'Revenus',
                data: incomeData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
            },
        ],
    };

    // Options pour configurer le graphique
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Analyse des Tendances Financières',
            },
        },
    };

    // Fonction pour le bouton de retour
    const handleBack = () => {
        navigate(-1); // Retourne à la page précédente
    };

    return (
        <div className="container mx-auto p-4 pt-24">
            <h2 className="text-2xl font-bold mb-4">Analyse des Tendances</h2>

            {/* Bouton de retour */}
            <button 
                onClick={handleBack} 
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300 mb-4"
            >
                Retour
            </button>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default TendanceAnalyse;
