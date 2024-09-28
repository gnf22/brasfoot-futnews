import { useEffect, useState } from 'react';
import { assignCoachToTeam, removeCoachFromTeam } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const WelcomePage = ({ name }: { name: string }) => {
  const [teams, setTeams] = useState<{ id: string; name: string; coach?: string }[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const db = getFirestore();

  const normalizeTeamName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[áãâ]/g, 'a')
      .replace(/[éê]/g, 'e')
      .replace(/[í]/g, 'i')
      .replace(/[óô]/g, 'o')
      .replace(/[ú]/g, 'u');
  };

  useEffect(() => {
    // Escuta as mudanças na coleção "teams"
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name, // Certifique-se de que 'name' existe
          coach: data.coach // Isso pode ser opcional, dependendo da estrutura
        };
      });
      setTeams(teamData);
  
      // Verifica se o usuário já é treinador de um time e atualiza o estado
      const currentTeam = teamData.find(team => team.coach === name);
      setCurrentTeamId(currentTeam ? currentTeam.id : null);
    });
  
    return () => unsubscribe();
  }, [db, name]);
  

  const handleSelectTeam = async (teamId: string) => {
    // Verifica se o usuário já é treinador de um time
    if (currentTeamId) {
      // Remove o treinador do time atual antes de atribuir o novo
      await removeCoachFromTeam(currentTeamId);
    }
    // Atribui o novo time ao usuário
    await assignCoachToTeam(teamId, name);
  };

  const handleGiveUpTeam = async (teamId: string) => {
    await removeCoachFromTeam(teamId);
  };

  return (
    <div className="outer-container"> {/* Novo container externo */}
      <div className="container">
        <h1>Bem-vindo, {name}!</h1>
        <ul>
          {teams
            .sort((a, b) => a.name.localeCompare(b.name)) // Ordena os times em ordem alfabética
            .map((team) => (
              <li key={team.id}>
                <img
                  src={`${import.meta.env.BASE_URL}/assets/logos/${normalizeTeamName(team.name)}.svg`}
                  alt={`${team.name} escudo`}
                  className="team-logo"
                />
                <div className="team-details">
                  <span className="team-name">{team.name}</span>
                  {team.coach && (
                    <span className="team-coach">Treinador: {team.coach}</span>
                  )}
                  <div className="team-buttons">
                    {!team.coach && !currentTeamId && (
                      <button className="choose" onClick={() => handleSelectTeam(team.id)}>
                        Treinar
                      </button>
                    )}
                    {team.coach === name && (
                      <button className="despair" onClick={() => handleGiveUpTeam(team.id)}>
                        Demitir-se
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
  
  
};

export default WelcomePage;
