import { useState } from 'react';
import { ClientListOptimized } from '../components/clients/ClientListOptimized';
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

  return <ClientListOptimized onSelectClient={setSelectedClientId} />;
};
