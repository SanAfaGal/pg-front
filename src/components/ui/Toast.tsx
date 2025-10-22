import { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    error: 'bg-[#E40303] text-white',
    success: 'bg-[#0000A8] text-white',
    info: 'bg-[#8C93C2] text-white',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${styles[type]} rounded-lg shadow-2xl px-6 py-4 flex items-center gap-3 min-w-[300px] max-w-md`}>
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="hover:opacity-75 transition-opacity"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
