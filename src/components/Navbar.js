import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../config/firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState(location.pathname);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Menu mobile
    const dropdownRef = useRef(null);
    const profileDropdownRef = useRef(null);
    const [user, setUser] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const firstLetter = user ? user.email.charAt(0).toUpperCase() : '';

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            closeDropdown();
        }
        if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
            setIsProfileDropdownOpen(false);
        }
    };

    const closeDropdown = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setTimeoutId(setTimeout(() => {
            setIsDropdownOpen(false);
        }, 300));
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            clearTimeout(timeoutId);
        };
    }, [timeoutId]);

    // Toggle menu mobile
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-md fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faDollarSign} className="text-white text-2xl" />
                    <span className="text-white text-2xl font-bold">FinTrack</span>
                </div>

                {/* Icone pour menu mobile */}
                <div className="block lg:hidden">
                    <button onClick={toggleMobileMenu} className="text-white">
                        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-2xl" />
                    </button>
                </div>

                {/* Liens de navigation pour grand écran */}
                <ul className={`lg:flex items-center space-x-8 relative hidden ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
                    <li>
                        <Link
                            to="/"
                            className={`text-white px-2 py-1 rounded hover:bg-blue-500 transition duration-300 ${activeLink === '/' ? 'bg-blue-500' : ''}`}
                            onClick={() => {
                                setActiveLink('/');
                                closeDropdown();
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            Accueil
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard"
                            className={`text-white px-2 py-1 rounded hover:bg-blue-500 transition duration-300 ${activeLink === '/dashboard' ? 'bg-blue-500' : ''}`}
                            onClick={() => {
                                setActiveLink('/dashboard');
                                closeDropdown();
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            Dashboard
                        </Link>
                    </li>
                    {/* Dropdown fonctionnalités */}
                    <li className="relative" ref={dropdownRef}
                        onMouseEnter={() => {
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                            }
                            setIsDropdownOpen(true);
                        }}
                        onMouseLeave={closeDropdown}
                    >
                        <button className={`text-white px-2 py-1 rounded hover:bg-blue-500 transition duration-300 ${isDropdownOpen ? 'bg-blue-500' : ''}`}>
                            Fonctionnalités
                        </button>
                        {isDropdownOpen && (
                            <ul className="absolute bg-white text-gray-800 right-0 mt-2 w-48 rounded shadow-lg z-50">
                                <li className="hover:bg-gray-200 px-4 py-2">
                                    <Link to="/suivi-des-depenses" onClick={() => {
                                        setActiveLink('/suivi-des-depenses');
                                        closeDropdown();
                                    }}>
                                        Suivi des dépenses
                                    </Link>
                                </li>
                                <li className="hover:bg-gray-200 px-4 py-2">
                                    <Link to="/Budget" onClick={() => {
                                        setActiveLink('/Budget');
                                        closeDropdown();
                                    }}>
                                        Budget
                                    </Link>
                                </li>
                                <li className="hover:bg-gray-200 px-4 py-2">
                                    <Link to="/Analyse" onClick={() => {
                                        setActiveLink('/Analyse');
                                        closeDropdown();
                                    }}>
                                        Analyse et tendance
                                    </Link>
                                </li>
                                <li className="hover:bg-gray-200 px-4 py-2">
                                    <Link to="/IncomeTracker" onClick={() => {
                                        setActiveLink('/IncomeTracker');
                                        closeDropdown();
                                    }}>
                                        Mes revenus
                                    </Link>
                                </li>
                                <li className="hover:bg-gray-200 px-4 py-2">
                                    <Link to="/Notifications" onClick={() => {
                                        setActiveLink('/Notifications');
                                        closeDropdown();
                                    }}>
                                        Notifications
                                    </Link>
                                </li>
                                <li className="hover:bg-gray-200 px-4 py-2">
                                    <Link to="/debts" onClick={() => {
                                        setActiveLink('/debts');
                                        closeDropdown();
                                    }}>
                                        Dettes
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>

                {/* Bouton connexion / profile */}
                <div className="flex items-center">
                    {!user ? (
                        <Link to="/Login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                            Sign In
                        </Link>
                    ) : (
                        <div className="relative ml-4" ref={profileDropdownRef}>
                            <button
                                onClick={toggleProfileDropdown}
                                className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl"
                            >
                                {firstLetter}
                            </button>
                            {isProfileDropdownOpen && (
                                <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-50">
                                    <li className="hover:bg-gray-200 px-4 py-2">
                                        <Link to="/Parametres">Paramètres</Link>
                                    </li>
                                    <li className="hover:bg-gray-200 px-4 py-2">
                                        <button onClick={handleLogout} className="w-full text-left">
                                            Déconnexion
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Menu mobile */}
            {isMobileMenuOpen && (
                <ul className="bg-gray-800 lg:hidden flex flex-col space-y-2 py-4">
                    <li>
                        <Link
                            to="/"
                            className="text-white px-4 py-2 hover:bg-blue-500"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Accueil
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard"
                            className="text-white px-4 py-2 hover:bg-blue-500"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    </li>
                    {/* Ajoute d'autres liens ici pour le mobile */}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
