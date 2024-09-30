import React from 'react';

const CopaAmericaEuroPage: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div>
      <h1>Copa América / Eurocopa</h1>
      <p>Bem-vindo, {name}! Prepare-se para escolher sua seleção.</p>
    </div>
  );
};

export default CopaAmericaEuroPage;
