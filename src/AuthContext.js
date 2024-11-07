import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [role, setRole] = useState('');
    const [jwt, setJwt] = useState('');
    

    return (
        <AuthContext.Provider value={{ role, setRole, jwt, setJwt }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };