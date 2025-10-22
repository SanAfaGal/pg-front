import React from 'react';
import { getAccessToken, getRefreshToken } from '../../shared';

export const AuthDebug: React.FC = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debug</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Estado de Autenticación</h2>
          <div className="space-y-2">
            <p><strong>Access Token:</strong> {accessToken ? 'Presente' : 'No encontrado'}</p>
            <p><strong>Refresh Token:</strong> {refreshToken ? 'Presente' : 'No encontrado'}</p>
            {accessToken && (
              <div className="mt-2">
                <p><strong>Token (primeros 20 chars):</strong> {accessToken.substring(0, 20)}...</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">LocalStorage</h2>
          <div className="space-y-2">
            <p><strong>access_token:</strong> {localStorage.getItem('access_token') ? 'Presente' : 'No encontrado'}</p>
            <p><strong>refresh_token:</strong> {localStorage.getItem('refresh_token') ? 'Presente' : 'No encontrado'}</p>
          </div>
        </div>

        <div className="p-4 bg-yellow-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Instrucciones</h2>
          <div className="space-y-2 text-sm">
            <p>1. Si no hay tokens, ve a "Login" y inicia sesión</p>
            <p>2. Si hay tokens pero sigue el error 401, el token puede estar expirado</p>
            <p>3. Verifica que tu API esté corriendo y acepte el token</p>
          </div>
        </div>
      </div>
    </div>
  );
};
