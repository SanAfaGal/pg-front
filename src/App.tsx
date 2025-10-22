import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './features/auth';
import { tokenManager } from './shared/api/apiClient';

const AUTH_DISABLED = import.meta.env.VITE_DISABLE_AUTH === 'true';

function App() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  const handleLoginSuccess = (accessToken: string, refreshToken: string) => {
    tokenManager.setTokens(accessToken, refreshToken);
    // The useAuth hook will automatically detect the token change and fetch user data
  };

  if (isLoading && !AUTH_DISABLED) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-powergym-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-powergym-charcoal">Cargando PowerGym AG...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !AUTH_DISABLED) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Dashboard onLogout={logout} />;
}

export default App;
