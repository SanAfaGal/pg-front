import React from 'react';

export const ConfigDebug: React.FC = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const useMockApi = import.meta.env.VITE_USE_MOCK_API;
  const disableAuth = import.meta.env.VITE_DISABLE_AUTH;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configuración Debug</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Variables de Entorno</h2>
          <div className="space-y-2">
            <p><strong>VITE_API_BASE_URL:</strong> {apiBaseUrl || 'No definido'}</p>
            <p><strong>VITE_USE_MOCK_API:</strong> {useMockApi || 'No definido'}</p>
            <p><strong>VITE_DISABLE_AUTH:</strong> {disableAuth || 'No definido'}</p>
          </div>
        </div>

        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Configuración Calculada</h2>
          <div className="space-y-2">
            <p><strong>API Base URL:</strong> {apiBaseUrl || 'http://localhost:8000'}</p>
            <p><strong>Usando Mock API:</strong> {useMockApi === 'true' ? 'Sí' : 'No'}</p>
            <p><strong>Auth Deshabilitado:</strong> {disableAuth === 'true' ? 'Sí' : 'No'}</p>
          </div>
        </div>

        <div className="p-4 bg-yellow-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Instrucciones</h2>
          <div className="space-y-2 text-sm">
            <p>1. Para usar la API real, crea un archivo <code>.env</code> en la raíz del proyecto con:</p>
            <pre className="bg-gray-200 p-2 rounded text-xs">
{`VITE_API_BASE_URL=http://tu-api-url.com
VITE_USE_MOCK_API=false
VITE_DISABLE_AUTH=true`}
            </pre>
            <p>2. Reinicia el servidor de desarrollo después de crear el archivo .env</p>
            <p>3. Verifica que tu API esté corriendo en la URL especificada</p>
          </div>
        </div>
      </div>
    </div>
  );
};
