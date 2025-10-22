import { Modal } from '../ui/Modal';
import { FacialRegisterForm } from '../biometrics/FacialRegisterForm';
import { type BiometricData } from '../../features/clients';

interface BiometricCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clientId: string;
  clientName: string;
  biometric?: BiometricData;
}

export const BiometricCaptureModal = ({
  isOpen,
  onClose,
  onSuccess,
  clientId,
  clientName,
  biometric,
}: BiometricCaptureProps) => {
  const handleSuccess = () => {
    onSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registro Facial"
      size="xl"
    >
      <FacialRegisterForm
        clientId={clientId}
        clientName={clientName}
        biometric={biometric}
        onSuccess={handleSuccess}
        onCancel={onClose}
      />
    </Modal>
  );
};
