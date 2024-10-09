import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { collection, onSnapshot, updateDoc, doc, deleteDoc, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';

const Notification = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const user = auth.currentUser; // Vérifier si l'utilisateur est connecté

    useEffect(() => {
        if (user) {
            // Récupérer les notifications
            const notificationsCollection = collection(db, 'notifications');
            const unsubscribe = onSnapshot(notificationsCollection, (snapshot) => {
                const fetchedNotifications = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotifications(fetchedNotifications);
            });

            // Récupérer les dettes de l'utilisateur
            const debtsCollection = collection(db, 'debts');
            const debtsQuery = query(debtsCollection, where('userId', '==', user.uid));
            const unsubscribeDebts = onSnapshot(debtsQuery, (snapshot) => {
                snapshot.docs.forEach(async (doc) => {
                    const debt = doc.data();
                    const dueDate = new Date(debt.dueDate.seconds * 1000); // Convertir en date
                    const today = new Date();
                    const oneDayBefore = new Date(dueDate);
                    oneDayBefore.setDate(dueDate.getDate() - 1);

                    // Vérifier si la date d'échéance est demain
                    if (today.toDateString() === oneDayBefore.toDateString()) {
                        const notificationExists = notifications.some(notification => 
                            notification.message.includes(`Votre dette de ${debt.amount} $ est due demain.`)
                        );

                        // Ajouter une notification si elle n'existe pas déjà
                        if (!notificationExists) {
                            await addDoc(notificationsCollection, {
                                message: `Avertissement : Votre dette de ${debt.amount} $ est due demain.`,
                                date: new Date(),
                                isRead: false,
                            });
                        }
                    }
                });
            });

            return () => {
                unsubscribe(); // Se désinscrire des notifications
                unsubscribeDebts(); // Se désinscrire des dettes
            };
        }
    }, [user, notifications]); // Ajouter notifications comme dépendance pour vérifier les nouvelles dettes

    const formatDate = (date) => {
        const timestamp = date.seconds ? new Date(date.seconds * 1000) : null;
        return timestamp ? timestamp.toLocaleDateString() : 'Date non disponible';
    };

    const markAsRead = async (id) => {
        const notificationRef = doc(db, 'notifications', id);
        await updateDoc(notificationRef, { isRead: true });
    };

    // Fonction pour vider l'historique des notifications
    const clearNotifications = async () => {
        const notificationsCollection = collection(db, 'notifications');
        const snapshot = await getDocs(notificationsCollection);

        // Supprimer chaque notification
        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        // Réinitialiser l'état
        setNotifications([]);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-red-600 font-semibold bg-red-100 border border-red-300 rounded-md p-4 shadow-md">
                    Vous devez être connecté pour accéder à cette fonctionnalité.
                </p>
            </div>
        );
    }

    return (
       
            <div className="container mx-auto p-4 pt-24"> 
        
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-500 hover:text-blue-700"
                >
                    <FaArrowLeft className="mr-2" />
                    Retour
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-4">Notifications</h2>

            {/* Bouton pour vider l'historique */}
            <button
                onClick={clearNotifications}
                className="mb-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            >
                Vider l'historique
            </button>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                {notifications.length === 0 ? (
                    <p>Aucune notification.</p>
                ) : (
                    <ul>
                        {notifications.map((notification) => (
                            <li key={notification.id} className="mb-4 border-b pb-2">
                                <div>
                                    <strong>{notification.message}</strong>
                                </div>
                                <div className="text-gray-500 text-sm">{formatDate(notification.date)}</div>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                    >
                                        Marquer comme lu
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notification;
