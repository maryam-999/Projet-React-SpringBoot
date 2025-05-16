// AuthContext.js
import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/url';
import { useSnackbar } from 'notistack';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(JSON.parse(localStorage.getItem('authTokens')).accessToken) : null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value
        })
      });

      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        const decodedToken = jwt_decode(data.accessToken);
        setUser(decodedToken);
        localStorage.setItem('authTokens', JSON.stringify(data));

        switch (decodedToken.role) {
          case 'ADMIN':
            navigate('/AdminDashboard/home');
            break;
          case 'STAGIAIRE':
            navigate('/StagiaireDashboard/home');
            break;
          case 'TUTEUR':
            navigate('/TuteurDashboard/home');
            break;
          default:
            enqueueSnackbar('Rôle inconnu !', { variant: 'error' });
        }
      } else {
        enqueueSnackbar(`L'email ou le mot de passe est incorrect.`, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Erreur réseau, veuillez réessayer.', { variant: 'error' });
    }
  }

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/');
  }

  const updateToken = async () => {
    if (!authTokens?.refreshToken) {
      logoutUser();
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}auth/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: authTokens.refreshToken })
      });

      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwt_decode(data.accessToken));
        localStorage.setItem('authTokens', JSON.stringify(data));
      } else {
        enqueueSnackbar('Session expirée, veuillez vous reconnecter.', { variant: 'warning' });
        logoutUser();
      }
    } catch (error) {
      enqueueSnackbar('Erreur réseau lors de la mise à jour du token.', { variant: 'error' });
      logoutUser();
    }
  };

  useEffect(() => {
    let interval;

    if (authTokens) {
      setUser(jwt_decode(authTokens.accessToken));

      //  Met à jour le token toutes les 14 minutes 
      interval = setInterval(updateToken, 14 * 60 * 1000);
    }

    setLoading(false);

    return () => clearInterval(interval);
  }, [authTokens]);

  const contextData = {
    user,
    authTokens,
    setAuthTokens,
    setUser,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
