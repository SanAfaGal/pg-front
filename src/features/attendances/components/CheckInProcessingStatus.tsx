import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Loader2, Upload, Scan, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ProcessingStage = 'uploading' | 'processing' | 'verifying' | 'finalizing';

interface CheckInProcessingStatusProps {
  stage: ProcessingStage;
  message?: string;
}

const STAGE_CONFIG: Record<ProcessingStage, { icon: React.ReactNode; label: string; description: string }> = {
  uploading: {
    icon: <Upload className="w-6 h-6" />,
    label: 'Subiendo imagen',
    description: 'Estamos enviando tu foto al servidor...',
  },
  processing: {
    icon: <Scan className="w-6 h-6" />,
    label: 'Analizando rostro',
    description: 'Reconociendo tu identidad mediante reconocimiento facial...',
  },
  verifying: {
    icon: <CheckCircle2 className="w-6 h-6" />,
    label: 'Verificando acceso',
    description: 'Comprobando el estado de tu suscripción y membresía...',
  },
  finalizing: {
    icon: <CheckCircle2 className="w-6 h-6" />,
    label: 'Finalizando',
    description: 'Completando el proceso de check-in...',
  },
};

export const CheckInProcessingStatus: React.FC<CheckInProcessingStatusProps> = ({
  stage,
  message,
}) => {
  const config = STAGE_CONFIG[stage];

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 w-full">
      <div className="flex flex-col items-center text-center space-y-6 w-full">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600"
            />
            <div className="relative z-10 text-blue-600">
              {config.icon}
            </div>
          </div>
        </motion.div>

        {/* Stage Label */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
            {config.label}
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </h3>
          <p className="text-gray-700 font-medium">{config.description}</p>
        </motion.div>

        {/* Custom Message */}
        {message && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
              <p className="text-sm text-gray-700">{message}</p>
            </div>
          </motion.div>
        )}

        {/* Progress Indicator */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progreso del proceso</span>
            <span className="font-semibold">
              {stage === 'uploading' ? '25%' : 
               stage === 'processing' ? '50%' : 
               stage === 'verifying' ? '75%' : '90%'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: stage === 'uploading' ? '25%' : 
                       stage === 'processing' ? '50%' : 
                       stage === 'verifying' ? '75%' : '90%',
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Reassuring Message */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm w-full"
        >
          <p className="text-xs text-gray-600 flex items-center gap-2 justify-center">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            <span>Por favor espera, el proceso puede tardar unos segundos</span>
          </p>
        </motion.div>
      </div>
    </Card>
  );
};

