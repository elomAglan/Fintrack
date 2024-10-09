import React, { useState } from 'react';

const BudgetTracker = () => {
    const [budget, setBudget] = useState(5000); // Budget initial
    const [expenses, setExpenses] = useState(0); // Dépenses initiales

    // Fonction pour ajouter des dépenses
    const handleAddExpense = (amount) => {
        if (amount > 0) {
            setExpenses(expenses + amount);
        }
    };

    const remainingBudget = budget - expenses; // Calcul du budget restant

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Suivi du Budget</h2>
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <h3 className="text-xl font-semibold mb-2">Budget Total</h3>
                <p className="text-lg">${budget.toFixed(2)}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <h3 className="text-xl font-semibold mb-2">Dépenses Totales</h3>
                <p className="text-lg">${expenses.toFixed(2)}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <h3 className="text-xl font-semibold mb-2">Budget Restant</h3>
                <p className="text-lg">${remainingBudget.toFixed(2)}</p>
            </div>
            <div className="mb-4">
                <input
                    type="number"
                    placeholder="Montant des dépenses"
                    className="border rounded-lg p-2 mr-2"
                    onChange={(e) => handleAddExpense(Number(e.target.value))}
                />
                <button
                    onClick={() => handleAddExpense(Number(document.getElementById('expense-input').value))}
                    className="bg-blue-500 text-white rounded-lg p-2"
                >
                    Ajouter Dépense
                </button>
            </div>
        </div>
    );
};

export default BudgetTracker;
