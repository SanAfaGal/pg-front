import { useState, FormEvent } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toast } from '../components/ui/Toast';
import { API_CONFIG, API_ENDPOINTS } from '../shared';

interface LoginProps {
  onLoginSuccess: (accessToken: string, refreshToken: string) => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123!');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

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
        setToast({ message: 'Inicio de sesión exitoso', type: 'success' });
        setTimeout(() => {
          onLoginSuccess(result.access_token, result.refresh_token);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
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

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <Input
              type="text"
              label="Usuario"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              disabled={isLoading}
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
