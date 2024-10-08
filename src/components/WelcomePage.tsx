import { useEffect, useState } from 'react';
import { assignCoachToTeam, removeCoachFromTeam } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { normalizeTeamName } from '../utils/normalizeTeamName';
import { useNavigate } from 'react-router-dom';

interface SettingsData {
  isSelectionCupEnabled: boolean;
  isWorldCupEnabled: boolean;
  isClubEnabled: boolean;
}

const WelcomePage = ({ name }: { name: string }) => {
  const [teams, setTeams] = useState<{ id: string; name: string; coach?: string }[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [isSelectionCupEnabled, setIsSelectionCupEnabled] = useState(false);
  const [isWorldCupEnabled, setIsWorldCupEnabled] = useState(false);
  const [isClubEnabled, setIsClubEnabled] = useState(false);

  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
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
      const settingsData: SettingsData = {
        isClubEnabled: false,
        isSelectionCupEnabled: false,
        isWorldCupEnabled: false,
      };
  
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        settingsData.isSelectionCupEnabled = data.isSelectionCupEnabled || false;
        settingsData.isWorldCupEnabled = data.isWorldCupEnabled || false;
        settingsData.isClubEnabled = data.isClubEnabled || false;
      });
  
      setIsSelectionCupEnabled(settingsData.isSelectionCupEnabled);
      setIsWorldCupEnabled(settingsData.isWorldCupEnabled);
      setIsClubEnabled(settingsData.isClubEnabled);
    }, (error) => {
      console.error("Erro ao ouvir configurações: ", error);
    });

    return () => unsubscribe();
  }, [db]);
  

  const handleSelectTeam = async (teamId: string) => {
    if (currentTeamId) {
      await removeCoachFromTeam(currentTeamId);
    }
    await assignCoachToTeam(teamId, name);
  };

  const handleGiveUpTeam = async (teamId: string) => {
    await removeCoachFromTeam(teamId);
  };

  return (
    <div className="outer-container">
      <div className="container">
        <div className="cup-button-container">
          <button 
            className="cup-button" 
            disabled={!isSelectionCupEnabled}
            onClick={() => navigate("/brasfoot-futnews/copa-america-euro")}
          >
            Copa América / Eurocopa
          </button>
          <button 
            className="cup-button" 
            disabled={!isWorldCupEnabled}
            onClick={() => navigate("/brasfoot-futnews/world-cup")}
          >
            Copa do Mundo
          </button>
        </div>

        <h1>Bem-vindo, {name}!</h1>
        <ul>
          {teams
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((team) => (
              <li key={team.id}>
                <img
                  src={`${import.meta.env.BASE_URL}/assets/logos/teams/${normalizeTeamName(team.name)}.svg`}
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
                        disabled={!isClubEnabled}
                        onClick={() => handleSelectTeam(team.id)}
                      >
                        Treinar
                      </button>
                    )}
                    {team.coach === name && (
                      <button 
                        className="despair" 
                        disabled={!isClubEnabled}
                        onClick={() => handleGiveUpTeam(team.id)}
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

export default WelcomePage;
