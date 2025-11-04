import { useState } from 'react';
import { ClientList } from '../features/clients';
import { ClientDetailOptimized } from './ClientDetailOptimized';

export const Clients = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

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
