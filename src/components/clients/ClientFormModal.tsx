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

export const ClientFormModal = ({
  isOpen,
  onClose,
  client,
  onSaved,
  onSuccess,
}: ClientFormModalProps) => {
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else if (onSaved) {
      onSaved();
      onClose();
    }
  };

  const initialData = client ? mapClientFromApi(client) : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
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
};
