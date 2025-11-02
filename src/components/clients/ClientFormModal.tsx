import { memo, useMemo, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { ClientFormOptimized } from './ClientFormOptimized';
import { type Client } from '../../features/clients';
import { mapClientFromApi } from '../../utils/clientMapper';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSaved?: () => void;
  onSuccess?: () => void;
}

/**
 * Modal wrapper for client form
 * Handles both create and edit modes
 */
export const ClientFormModal = memo(({
  isOpen,
  onClose,
  client,
  onSaved,
  onSuccess,
}: ClientFormModalProps) => {
  // Memoize initial form data
  const initialData = useMemo(() => 
    client ? mapClientFromApi(client) : undefined,
    [client]
  );

  // Handle form success with proper callback chain
  const handleSuccess = useCallback(() => {
    if (onSuccess) {
      onSuccess();
    } else if (onSaved) {
      onSaved();
      onClose();
    } else {
      onClose();
    }
  }, [onSuccess, onSaved, onClose]);

  // Memoize modal title
  const modalTitle = useMemo(() => 
    client ? 'Editar Cliente' : 'Registrar Nuevo Cliente',
    [client]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="xl"
    >
      <ClientFormOptimized
        initialData={initialData}
        clientId={client?.id}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
});

ClientFormModal.displayName = 'ClientFormModal';
