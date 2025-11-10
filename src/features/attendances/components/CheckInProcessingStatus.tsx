import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Loader2, Upload, Scan, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
}) => {
  const config = STAGE_CONFIG[stage];

  return (
    <Card className="p-6 sm:p-8 bg-white border border-gray-100 shadow-soft w-full max-w-2xl mx-auto" padding="none">
      <div className="flex flex-col items-center text-center space-y-6 w-full">
        {/* Animated Icon - Neumorphic Style */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] border border-gray-200/50">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-3xl border-2 border-gray-200 border-t-primary-500"
            />
            <div className="relative z-10 text-primary-500">
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
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
            {config.label}
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
          </h3>
          <p className="text-sm sm:text-base text-gray-600 font-medium">{config.description}</p>
        </motion.div>

        {/* Progress Indicator - Subtle */}
        <div className="w-full max-w-md space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progreso</span>
            <span className="font-semibold text-gray-700">
              {stage === 'uploading' ? '25%' : 
               stage === 'processing' ? '50%' : 
               stage === 'verifying' ? '75%' : '90%'}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-primary-500 h-full rounded-full"
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
      </div>
    </Card>
  );
};

