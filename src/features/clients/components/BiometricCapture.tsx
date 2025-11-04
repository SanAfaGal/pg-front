import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface BiometricCaptureProps {
  value?: string;
  onChange: (url: string) => void;
}

export const BiometricCapture = ({ value, onChange }: BiometricCaptureProps) => {
  const [preview, setPreview] = useState<string | undefined>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccione una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Preview Area */}
      <div className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-primary-200 ring-opacity-30 transition-all duration-300 group-hover:ring-opacity-50 group-hover:ring-primary-300">
                <img
                  src={preview}
                  alt="Preview de imagen"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <motion.button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-2 bg-error-500 text-white rounded-full hover:bg-error-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center border-2 border-dashed border-neutral-300 hover:border-primary-300 transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-medium">Sin imagen</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          leftIcon={<Upload className="w-4 h-4" />}
          className="min-w-[140px]"
        >
          {preview ? 'Cambiar foto' : 'Subir foto'}
        </Button>
      </div>

      {/* Helper Text */}
      <motion.p 
        className="text-xs text-center text-neutral-500 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        *Puede agregarse después desde los detalles del cliente
      </motion.p>
    </motion.div>
  );
};
