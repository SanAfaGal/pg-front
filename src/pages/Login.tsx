import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toast } from '../components/ui/Toast';
import { API_CONFIG, API_ENDPOINTS, tokenManager } from '../shared';
import { useAuth } from '../features/auth';

export const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validate = (): boolean => {
    const newErrors = { username: '', password: '' };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'El usuario es requerido';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({ username: '', password: '' });

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          setToast({ message: 'Usuario o contraseña incorrectos', type: 'error' });
        } else if (response.status === 400) {
          setToast({ message: 'Usuario inactivo', type: 'error' });
        } else {
          setToast({ message: errorData.detail || 'Error al iniciar sesión', type: 'error' });
        }
        return;
      }

      const result = await response.json();

      if (result.access_token && result.refresh_token) {
        tokenManager.setTokens(result.access_token, result.refresh_token);
        setToast({ message: 'Inicio de sesión exitoso', type: 'success' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setToast({ message: 'Error al iniciar sesión', type: 'error' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setToast({ message: 'Error al conectar con el servidor', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-powergym-charcoal">Cargando...</p>
        </div>
      </div>
    );
  }

  // Don't render login if already authenticated (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-soft p-10 border border-gray-100 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6">
              <img 
                src="/logo.svg" 
                alt="PowerGym AG" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-powergym-charcoal mb-2">PowerGym AG</h1>
            <p className="text-gray-500">Sistema de Gestión</p>
          </div>

          <div className="mb-6 text-center">
            <p className="text-sm text-neutral-600">
              ¿No tienes cuenta?{' '}
              <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
                Volver al inicio
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <Input
              type="text"
              label="Usuario"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              disabled={isLoading}
              autoComplete="off"
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              disabled={isLoading}
              autoComplete="off"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
            >
              Iniciar sesión
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};
