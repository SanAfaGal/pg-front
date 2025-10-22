import { CheckCircle2, ScanFace, Loader2, Fingerprint } from 'lucide-react';
import { type BiometricData } from '../../features/clients';

interface BiometricStatusProps {
  biometric?: BiometricData;
  isLoading?: boolean;
  className?: string;
}

export const BiometricStatus = ({ biometric, isLoading, className = '' }: BiometricStatusProps) => {
  console.log('BiometricStatus - props received:', { biometric, isLoading });

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        <span className="text-sm text-gray-600">Verificando biometría...</span>
      </div>
    );
  }

  const hasBiometric = biometric?.thumbnail ? true : false;

  console.log('BiometricStatus - computed values:', { hasBiometric });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Registro Facial */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ScanFace className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-700">Registro Facial</span>
        </div>
        {hasBiometric ? (
          <span className="text-xs font-semibold text-green-600">
            Registrado
          </span>
        ) : (
          <span className="text-xs font-semibold text-gray-500">
            No registrado
          </span>
        )}
      </div>

      {/* Huella Digital */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Fingerprint className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-700">Huella Digital</span>
        </div>
        <span className="text-xs font-semibold text-gray-500">
          No registrada
        </span>
      </div>
    </div>
  );
};