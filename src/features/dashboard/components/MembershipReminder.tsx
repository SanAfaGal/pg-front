import { memo } from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';

interface MembershipReminderProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal que muestra un recordatorio para revisar las membresías.
 * Se muestra automáticamente una vez al iniciar sesión por sesión de usuario.
 * 
 * El componente está memoizado para evitar re-renders innecesarios.
 */
export const MembershipReminder = memo(({ 
  isOpen, 
  onClose
}: MembershipReminderProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recordatorio de Membresías"
      size="md"
    >
      <div className="space-y-4">
        {/* Icono y mensaje principal */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-amber-100 rounded-xl">
            <AlertCircle className="w-6 h-6 text-amber-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              Te recordamos revisar las membresías. 
              Por favor, ve a la sección de <strong>Suscripciones</strong> para 
              actualizar las que expiran y activar las que están programadas.
            </p>
          </div>
        </div>

        {/* Mensaje informativo */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Nota:</strong> Si ya realizaste estas acciones hoy, no es necesario 
            volver a hacerlo hasta mañana. Solo puedes omitir este recordatorio.
          </p>
        </div>
      </div>
    </Modal>
  );
});

MembershipReminder.displayName = 'MembershipReminder';

