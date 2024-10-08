import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components//Login';
import Home from './components/Home';
import { AuthProvider } from './AuthContext';



const App = () => {
    return (
        <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
        </AuthProvider>
    );
};

export default App;