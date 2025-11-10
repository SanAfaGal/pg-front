import { useState, useEffect } from 'react';
import { ClientList } from '../features/clients';
import { ClientDetailOptimized } from './ClientDetailOptimized';

export const Clients = () => {
  // Leer clientId del localStorage si existe (para navegación desde otras páginas)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(() => {
    const storedClientId = localStorage.getItem('selected_client_id');
    if (storedClientId) {
      // Limpiar inmediatamente después de leer
      localStorage.removeItem('selected_client_id');
      return storedClientId;
    }
    return null;
  });

  // Limpiar localStorage si el componente se desmonta sin seleccionar cliente
  useEffect(() => {
    return () => {
      localStorage.removeItem('selected_client_id');
    };
  }, []);

  if (selectedClientId) {
    return (
      <ClientDetailOptimized
        clientId={selectedClientId}
        onBack={() => setSelectedClientId(null)}
      />
    );
  }

  return <ClientList onSelectClient={setSelectedClientId} />;
};
