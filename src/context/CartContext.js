import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const CartContext = createContext();

// Provider pour encapsuler les composants qui utiliseront le contexte
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]); // État pour stocker les éléments du panier

    // Fonction pour ajouter un élément au panier
    const addItemToCart = (item) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };

    // Fonction pour supprimer un élément du panier
    const removeItemFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
    };

    // Fonction pour vider le panier
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useCart = () => {
    return useContext(CartContext);
};
