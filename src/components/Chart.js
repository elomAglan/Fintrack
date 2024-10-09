import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrement des composants Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = ({ transactions }) => {
    // Traitement des transactions pour obtenir les montants des dépenses et des revenus
    const chartData = {
        labels: ['Dépenses', 'Revenus'],
        datasets: [
            {
                label: 'Montant',
                data: [
                    transactions
                        .filter((transaction) => transaction.type === 'expense')
                        .reduce((acc, transaction) => acc + transaction.amount, 0), // Somme des dépenses
                    transactions
                        .filter((transaction) => transaction.type === 'income')
                        .reduce((acc, transaction) => acc + transaction.amount, 0), // Somme des revenus
                ],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Analyse des Transactions',
            },
        },
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Graphique des Transactions</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default Chart;
