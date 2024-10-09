import React from 'react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-500">404</h1>
            <h2 className="text-2xl font-semibold mt-4">Page non trouvée</h2>
            <p className="mt-2 text-gray-600">
                Désolé, la page que vous recherchez n'existe pas.
            </p>
            <a href="/" className="mt-4 text-blue-500 hover:underline">
                Retour à l'accueil
            </a>
        </div>
    );
};

export default NotFound;
