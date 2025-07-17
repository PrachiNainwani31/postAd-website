import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // ✅ Rehydrate user from token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !user) {
      fetch("http://localhost:5001/api/auth/validate", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            logout();
          }
        })
        .catch(() => logout());
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
