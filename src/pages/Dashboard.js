import React, { useEffect, useState } from 'react';
import { db, auth } from '../config/firebaseConfig'; // Assurez-vous que le chemin d'importation est correct
import { collection, getDocs, query, where } from 'firebase/firestore';

const Dashboard = () => {
    const [incomes, setIncomes] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [budget, setBudget] = useState(0);
    const [debts, setDebts] = useState(0); // État pour stocker le total des dettes
    const user = auth.currentUser; // Récupérer l'utilisateur connecté

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return; // Ne rien faire si aucun utilisateur n'est connecté

            try {
                // Récupérer les revenus de l'utilisateur
                const incomesCollection = collection(db, 'incomes');
                const incomesQuery = query(incomesCollection, where('userId', '==', user.uid));
                const incomesSnapshot = await getDocs(incomesQuery);
                const incomesList = incomesSnapshot.docs.map(doc => doc.data());
                // Convertir les montants en nombres et calculer le total
                const totalIncomes = incomesList.reduce((total, income) => total + Number(income.amount), 0);
                setIncomes(totalIncomes);

                // Récupérer les dépenses de l'utilisateur
                const expensesCollection = collection(db, 'expenses');
                const expensesQuery = query(expensesCollection, where('userId', '==', user.uid));
                const expensesSnapshot = await getDocs(expensesQuery);
                const expensesList = expensesSnapshot.docs.map(doc => doc.data());
                // Convertir les montants en nombres et calculer le total
                const totalExpenses = expensesList.reduce((total, expense) => total + Number(expense.amount), 0);
                setExpenses(totalExpenses);

                // Récupérer le budget de l'utilisateur
                const budgetsCollection = collection(db, 'budgets');
                const budgetsQuery = query(budgetsCollection, where('userId', '==', user.uid));
                const budgetsSnapshot = await getDocs(budgetsQuery);
                const budgetsList = budgetsSnapshot.docs.map(doc => doc.data());
                // Convertir les montants en nombres et calculer le total
                const totalBudget = budgetsList.reduce((total, budget) => total + Number(budget.amount), 0);
                setBudget(totalBudget);

                // Récupérer les dettes de l'utilisateur
                const debtsCollection = collection(db, 'debts'); // Remplacez 'debts' par le nom de votre collection de dettes
                const debtsQuery = query(debtsCollection, where('userId', '==', user.uid));
                const debtsSnapshot = await getDocs(debtsQuery);
                const debtsList = debtsSnapshot.docs.map(doc => doc.data());
                // Convertir les montants en nombres et calculer le total
                const totalDebts = debtsList.reduce((total, debt) => total + Number(debt.amount), 0);
                setDebts(totalDebts);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchData();
    }, [user]); // Dépendance à user pour relancer la récupération des données lorsque l'utilisateur change

    const remainingBudget = budget - expenses; // Calculer le budget restant

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>
            <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">Résumé financier</h3>
                <p>Bienvenue sur votre tableau de bord ! Ici, vous pouvez voir un aperçu de vos finances.</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-green-100 p-4 rounded-lg">
                        <h4 className="font-medium">Revenus</h4>
                        <p className="text-lg">${incomes}</p>
                    </div>
                    <div className="bg-red-100 p-4 rounded-lg">
                        <h4 className="font-medium">Dépenses</h4>
                        <p className="text-lg">${expenses}</p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-lg">
                        <h4 className="font-medium">Dettes</h4>
                        <p className="text-lg">${debts}</p> {/* Afficher le total des dettes ici */}
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg">
                        <h4 className="font-medium">Budget restant</h4>
                        <p className="text-lg">${remainingBudget}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
