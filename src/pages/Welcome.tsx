// src/pages/Welcome.tsx
import React from 'react';

interface WelcomeProps {
  users: { id: string; name: string }[];
}

const Welcome: React.FC<WelcomeProps> = ({ users }) => {
  const userName = localStorage.getItem('userName');

  return (
    <div>
      <h1>Bem-vindo, {userName}!</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Welcome;
