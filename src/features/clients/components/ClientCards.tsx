import { memo } from 'react';
import { motion } from 'framer-motion';
import { ClientCard } from './ClientCard';
import { type Client } from '../..';

interface ClientCardsProps {
  clients: Client[];
  onView?: (clientId: string) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  isDeleting?: boolean;
}

/**
 * Componente que renderiza un grid de cards de clientes
 * Grid responsive: 1 columna en móvil, 2 en tablet, 3 en desktop
 */
export const ClientCards = memo(({
  clients,
  onView,
  onEdit,
  onDelete,
  isDeleting = false,
}: ClientCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
      {clients.map((client) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ClientCard
            client={client}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </motion.div>
      ))}
    </div>
  );
});

ClientCards.displayName = 'ClientCards';

