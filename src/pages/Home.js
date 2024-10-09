import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaChartLine, FaRegCalendarAlt, FaClipboardList } from 'react-icons/fa';

const Home = () => {
    return (
        <div>
            {/* Section d'accueil avec l'image de fond */}
            <div 
                className="relative h-screen flex items-center justify-center bg-cover bg-center" 
                style={{ 
                    backgroundImage: 'url(/images/welcome.jpg)', 
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-900 opacity-70"></div>
                <div className="relative z-10 text-white text-center p-6">
                    <h1 className="text-6xl font-extrabold mb-4">Bienvenue sur l'Application de Gestion des Finances</h1>
                    <p className="mt-3 text-lg">Gérez vos finances, suivez vos dépenses et prenez le contrôle de vos revenus.</p>
                </div>
            </div>

            {/* Contenu sous l'image de fond */}
            <div className="container mx-auto p-8">
                {/* Fonctionnalités Principales */}
                <div className="text-center mt-8">
                    <h2 className="text-4xl font-bold mb-12 text-gray-800">Mes Services</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* Service 1 */}
                        <div className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
                            <Link to="/suivi-des-depenses" className="flex items-center justify-center space-x-3">
                                <FaMoneyBillWave className="text-blue-600 text-4xl" />
                                <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-blue-600">
                                    Suivi des Dépenses
                                </h3>
                            </Link>
                            <p className="mt-3 text-gray-600">Suivez facilement vos dépenses quotidiennes et mensuelles.</p>
                        </div>

                        {/* Service 2 */}
                        <div className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
                            <Link to="/budget" className="flex items-center justify-center space-x-3">
                                <FaClipboardList className="text-blue-600 text-4xl" />
                                <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-blue-600">
                                    Création de Budgets
                                </h3>
                            </Link>
                            <p className="mt-3 text-gray-600">Créez des budgets sur mesure pour mieux gérer vos finances.</p>
                        </div>

                        {/* Service 3 */}
                        <div className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
                            <Link to="/Analyse" className="flex items-center justify-center space-x-3">
                                <FaChartLine className="text-blue-600 text-4xl" />
                                <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-blue-600">
                                    Analyse des Tendances
                                </h3>
                            </Link>
                            <p className="mt-3 text-gray-600">Découvrez vos habitudes de dépenses avec des graphiques clairs.</p>
                        </div>

                        {/* Service 4 */}
                        <div className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
                            <Link to="/Notifications" className="flex items-center justify-center space-x-3">
                                <FaRegCalendarAlt className="text-blue-600 text-4xl" />
                                <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-blue-600">
                                    Notifications
                                </h3>
                            </Link>
                            <p className="mt-3 text-gray-600">Recevez des alertes pour les échéances importantes.</p>
                        </div>

                        {/* Service 5 */}
                        <div className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
                            <Link to="/IncomeTracker" className="flex items-center justify-center space-x-3">
                                <FaMoneyBillWave className="text-blue-600 text-4xl" />
                                <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-blue-600">
                                    Mes Revenus
                                </h3>
                            </Link>
                            <p className="mt-3 text-gray-600">Suivez et gérez efficacement vos revenus.</p>
                        </div>

                        {/* Service 6 */}
                        <div className="group bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
                            <Link to="/debts" className="flex items-center justify-center space-x-3">
                                <FaRegCalendarAlt className="text-blue-600 text-4xl" />
                                <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-blue-600">
                                    Mes Dettes
                                </h3>
                            </Link>
                            <p className="mt-3 text-gray-600">Suivez et gérez facilement vos dettes.</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <button className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                        Commencez à suivre vos finances maintenant
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
