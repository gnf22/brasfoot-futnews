import { useEffect, useState } from 'react';
import { assignCoachToWorldCupTeam, removeCoachFromWorldCupTeam } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { normalizeTeamName } from '../utils/normalizeTeamName';
import { useNavigate } from 'react-router-dom';


const CopaDoMundoPage = ({ name }: { name: string }) => {
  const [teams, setTeams] = useState<{ id: string; name: string; coach?: string }[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [isWorldCupEnabled, setIsWorldCupEnabled] = useState(false);

  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "world_cup"), (snapshot) => {
      const teamData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          coach: data.coach
        };
      });

      setTeams(teamData);
      const currentTeam = teamData.find(team => team.coach === name);
      setCurrentTeamId(currentTeam ? currentTeam.id : null);
    });
  
    return () => unsubscribe();
  }, [db, name]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "settings"), (snapshot) => {
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.isWorldCupEnabled !== undefined) {
          setIsWorldCupEnabled(data.isWorldCupEnabled);
        }
      });
    });

    return () => unsubscribe();
  }, [db]);
  

  const handleSelectTeam = async (teamId: string) => {
    if (currentTeamId) {
      await removeCoachFromWorldCupTeam(currentTeamId);
    }
    await assignCoachToWorldCupTeam(teamId, name);
  };

  const handleGiveUpTeam = async (teamId: string) => {
    await removeCoachFromWorldCupTeam(teamId);
  };

  return (
    <div className="outer-container">
      <div className="container">
        <div className="cup-button-container">
          <button 
            className="cup-button"
            onClick={() => navigate("/brasfoot-futnews/welcome")}
          >
            Clubes
          </button>
        </div>

        <h1>Bem-vindo, {name}!</h1>
        <ul>
          {teams
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((team) => (
              <li key={team.id}>
                <img
                  src={`${import.meta.env.BASE_URL}/assets/logos/national_teams/${normalizeTeamName(team.name)}.svg`}
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
                      <button 
                        className="choose" 
                        onClick={() => handleSelectTeam(team.id)}
                        disabled={!isWorldCupEnabled}
                      >
                        Treinar
                      </button>
                    )}
                    {team.coach === name && (
                      <button 
                        className="despair" 
                        onClick={() => handleGiveUpTeam(team.id)}
                        disabled={!isWorldCupEnabled}
                      >
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

export default CopaDoMundoPage;
