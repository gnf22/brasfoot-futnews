// src/pages/Home.tsx
import React from 'react';
import UserInput from '../components/UserInput';

interface HomeProps {
  onCreateUser: (name: string) => void;
}

const Home: React.FC<HomeProps> = ({ onCreateUser }) => {
  return (
    <div>
      <h1>Brasfoot FutNews</h1>
      <p>Escreva seu nome</p>
      <UserInput onCreateUser={onCreateUser} />
    </div>
  );
};

export default Home;
