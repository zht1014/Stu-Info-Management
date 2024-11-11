import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [role, setRole] = useState('');
    const [jwt, setJwt] = useState('');
    const [userId, setUserId] = useState('');
    

    return (
        <AuthContext.Provider value={{ role, setRole, jwt, setJwt, userId, setUserId }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };