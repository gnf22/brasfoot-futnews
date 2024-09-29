import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import { checkUserExists } from './services/firebase';
import './styles.css';
import './cupButton.css';

function App() {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      checkUserExists(storedName).then((exists) => {
        setIsLogged(exists);
        if (!exists) {
          localStorage.removeItem('userName');
        }
      });
    }
  }, []);

  return (
    <Router>
      <AppRoutes isLogged={isLogged} onLogin={() => setIsLogged(true)} />
    </Router>
  );
}

export default App;
