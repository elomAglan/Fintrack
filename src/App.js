import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';  
import Home from './pages/Home';
import Budget from './pages/Budget';
import Dashboard from './pages/Dashboard';
import ExpenseTracker from './pages/ExpenseTracker';
import Analyse from './pages/Analyse';
import Notification from './pages/Notification'; 
import IncomeTracker from './pages/IncomeTracker';
import Login from './pages/Login';
import SignUp from './pages/SignUp'; 
import Parametre from './pages/Parametre';
import DebtManagement from './pages/DebtManagement';


function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/suivi-des-depenses" element={<ExpenseTracker />} />
                <Route path="/analyse" element={<Analyse />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/incometracker" element={<IncomeTracker />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} /> 
                <Route path="/parametres" element={<Parametre />} />
                <Route path="/debts" element={<DebtManagement />} />
            </Routes>
        </Router>
    );
}

export default App;
