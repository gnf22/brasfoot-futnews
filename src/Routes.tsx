// src/Routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import CopaAmericaEuroPage from './components/CopaAmericaEuroPage';
import CopaDoMundoPage from './components/CopaDoMundoPage';

const AppRoutes: React.FC<{ isLogged: boolean; onLogin: () => void }> = ({ isLogged, onLogin }) => {
  return (
    <Routes>
      <Route
        path="/brasfoot-futnews"
        element={isLogged ? <Navigate to="/brasfoot-futnews/welcome" /> : <LoginPage onLogin={onLogin} />}
      />
      <Route
        path="/brasfoot-futnews/welcome"
        element={isLogged ? <WelcomePage name={localStorage.getItem('userName')!} /> : <Navigate to="/brasfoot-futnews" />}
      />

      <Route 
        path='/brasfoot-futnews/copa-america-euro'
        element={isLogged ? <CopaAmericaEuroPage name={localStorage.getItem('userName')!} /> : <Navigate to="/brasfoot-futnews" />}
      />

      <Route 
        path='/brasfoot-futnews/world-cup'
        element={isLogged ? <CopaDoMundoPage name={localStorage.getItem('userName')!} /> : <Navigate to="/brasfoot-futnews" />}
      />
    </Routes>
  );
};

export default AppRoutes;
