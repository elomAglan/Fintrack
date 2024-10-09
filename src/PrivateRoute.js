// PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './useAuth'; // Un hook personnalisé pour l'authentification

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { user } = useAuth(); // Récupérer l'utilisateur connecté

    return (
        <Route 
            {...rest} 
            render={props => 
                user ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            } 
        />
    );
};

export default PrivateRoute;
