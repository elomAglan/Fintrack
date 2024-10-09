import React, { useState } from 'react';

const TransactionForm = ({ onAddTransaction }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense'); // 'expense' ou 'income'

    const handleSubmit = (e) => {
        e.preventDefault();
        if (amount && description) {
            const transaction = {
                amount: parseFloat(amount),
                description,
                type,
                date: new Date().toISOString(),
            };
            onAddTransaction(transaction); // Appel de la fonction pour ajouter la transaction
            setAmount(''); // Réinitialiser le champ montant
            setDescription(''); // Réinitialiser le champ description
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Ajouter une Transaction</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Montant</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Type de transaction</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                    >
                        <option value="expense">Dépense</option>
                        <option value="income">Revenu</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-lg p-2"
                >
                    Ajouter Transaction
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
