// src/components/TransactionList.js
import React from 'react';

const TransactionList = ({ transactions }) => {
    return (
        <ul className="bg-white shadow-md rounded-lg p-4">
            {transactions.length === 0 ? (
                <li>Aucune transaction disponible.</li>
            ) : (
                transactions.map((transaction) => (
                    <li key={transaction.id} className="flex justify-between">
                        <span>{transaction.type === 'expense' ? 'Dépense' : 'Revenu'}</span>
                        <span>{transaction.amount} €</span>
                        <span>{transaction.date}</span>
                    </li>
                ))
            )}
        </ul>
    );
};

export default TransactionList;
