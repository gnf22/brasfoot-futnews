import React, { useState } from 'react';
import { createUser } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [name, setName] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    await createUser(name);
    localStorage.setItem('userName', name);
    onLogin(); // chama a função que atualiza o estado de login
    navigate('/welcome'); // redireciona para a página de boas-vindas
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Brasfoot FutNews</h1>
      <p className="login-instruction">Escreva seu nome</p>
      <input
        type="text"
        placeholder="Nome..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="login-input"
      />
      <button onClick={handleLogin} className="login-button">Entrar</button>
    </div>
  );
};

export default LoginPage;
