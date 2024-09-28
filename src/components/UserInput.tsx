// src/components/UserInput.tsx
import React, { useState } from 'react';

interface UserInputProps {
  onCreateUser: (name: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ onCreateUser }) => {
  const [name, setName] = useState<string>('');

  const handleCreateUser = () => {
    if (name.trim() !== '') {
      onCreateUser(name);
      setName(''); // Limpa o input após o cadastro
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder='Nome...'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleCreateUser}>Entrar</button>
    </div>
  );
};

export default UserInput;
