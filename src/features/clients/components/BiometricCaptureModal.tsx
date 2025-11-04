import React from 'react';
import { ScanFace, X, Camera, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { FacialRegisterForm } from '../../../components/biometrics/FacialRegisterForm';
import { Card } from '../../../components/ui/Card';
import { type BiometricData } from '../..';

interface BiometricCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clientId: string;
  clientName: string;
  biometric?: BiometricData;
}

export const BiometricCaptureModal: React.FC<BiometricCaptureProps> = ({
  isOpen,
  onClose,
  onSuccess,
  clientId,
  clientName,
  biometric,
}) => {
  const hasExistingBiometric = biometric?.has_face_biometric;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestión de Biometría"
      size="xl"
    >
      <div className="space-y-6">
        {/* Información del Cliente */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ScanFace className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Cliente: {clientName}</h3>
              <p className="text-sm text-blue-700">
                {hasExistingBiometric 
                  ? 'Biometría facial registrada - Puedes actualizar el registro'
                  : 'Completa tu registro de biometría facial'}
              </p>
            </div>
            {hasExistingBiometric && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">Registrado</span>
              </div>
            )}
          </div>
        </Card>

        {/* Estado Actual */}
        {hasExistingBiometric && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900 mb-1">Registro Activo</p>
                <p className="text-sm text-green-800">
                  Este cliente ya tiene biometría facial registrada. Al capturar una nueva imagen, se actualizará el registro existente.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Instrucciones */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-2">Instrucciones para la captura</p>
              <ul className="text-sm text-amber-800 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Busca un lugar con buena iluminación natural</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Mantén el rostro centrado y mirando directamente a la cámara</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Elimina gafas, sombreros u objetos que cubran el rostro</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">•</span>
                  <span>Asegúrate de que el rostro esté completamente visible</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Formulario de Captura */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <FacialRegisterForm
            clientId={clientId}
            clientName={clientName}
            biometric={biometric}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};
