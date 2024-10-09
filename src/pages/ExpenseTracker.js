import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Remplacer useHistory par useNavigate
import { FaPlus, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ amount: '', category: '', description: '', date: '' });
    const navigate = useNavigate(); // Initialiser useNavigate

    // Charger les dépenses depuis Firestore pour l'utilisateur connecté
    useEffect(() => {
        const fetchExpenses = async () => {
            const user = auth.currentUser; // Obtenir l'utilisateur connecté
            if (user) {
                const userExpensesRef = query(collection(db, 'expenses'), where('userId', '==', user.uid));
                const querySnapshot = await getDocs(userExpensesRef);
                const expensesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setExpenses(expensesData);
            } else {
                // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
                navigate('/login'); // Remplacer history.push par navigate
            }
        };

        fetchExpenses();
    }, [navigate]);

    // Fonction pour ajouter une nouvelle dépense
    const addExpense = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (!user) {
            alert("Vous devez créer un compte ou vous connecter."); // Alerte avant la redirection
            navigate('/login'); // Rediriger vers la page de connexion
            return;
        }

        const newExpense = { ...form, amount: parseFloat(form.amount), date: form.date, userId: user.uid };

        try {
            const docRef = await addDoc(collection(db, 'expenses'), newExpense);
            setExpenses([...expenses, { ...newExpense, id: docRef.id }]);
            setForm({ amount: '', category: '', description: '', date: '' });
        } catch (error) {
            console.error("Erreur lors de l'ajout de la dépense: ", error);
        }
    };

    // Fonction pour supprimer une dépense
    const deleteExpense = async (id) => {
        try {
            await deleteDoc(doc(db, 'expenses', id));
            setExpenses(expenses.filter(expense => expense.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de la dépense: ", error);
        }
    };

    // Données pour le graphique des dépenses par catégorie
    const getCategoryData = () => {
        const categories = ['Alimentation', 'Transport', 'Loisirs', 'Logement', 'Autre'];
        const categorySums = categories.map(category =>
            expenses
                .filter(expense => expense.category === category)
                .reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
        );

        return {
            labels: categories,
            datasets: [
                {
                    label: 'Dépenses par catégorie',
                    data: categorySums,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                },
            ],
        };
    };

    return (
        <div className="container mx-auto p-4 pt-24"> {/* Changement ici pour le padding-top */}
            {/* Bouton de retour */}
            <div className="mb-4">
                <Link to="/" className="flex items-center text-blue-500 hover:text-blue-700">
                    <FaArrowLeft className="mr-2" />
                    Retour
                </Link>
            </div>

            <h2 className="text-2xl font-bold mb-4">Suivi des Dépenses</h2>

            <form onSubmit={addExpense} className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 font-bold">Montant</label>
                        <input
                            type="number"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold">Catégorie</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            required
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Sélectionnez une catégorie</option>
                            <option value="Alimentation">Alimentation</option>
                            <option value="Transport">Transport</option>
                            <option value="Loisirs">Loisirs</option>
                            <option value="Logement">Logement</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 font-bold">Description</label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-bold">Date</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                >
                    <FaPlus className="inline mr-2" /> Ajouter une dépense
                </button>
            </form>

            <h3 className="text-xl font-bold mb-4">Dépenses récentes</h3>
            <ul className="space-y-2">
                {expenses.map((expense) => (
                    <li key={expense.id} className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                            <span>{expense.description || 'Dépense sans description'}</span>
                            <span className="ml-4">{expense.amount} € - {expense.category}</span>
                        </div>
                        <button
                            onClick={() => deleteExpense(expense.id)}
                            className="ml-4 text-red-500 hover:text-red-700"
                        >
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>

            {/* Graphique des dépenses par catégorie */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Analyse des dépenses par catégorie</h3>
                <Bar data={getCategoryData()} />
            </div>
        </div>
    );
};

export default ExpenseTracker;
