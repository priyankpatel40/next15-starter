'use client';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  icon?: React.ReactNode; // Adjusted to allow more flexibility
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  position = 'top-center',
  icon,
}) => {
  useEffect(() => {
    switch (type) {
      case 'success':
        toast.success(message, { duration, position, icon });
        break;
      case 'error':
        toast.error(message, { duration, position, icon });
        break;
      case 'warning':
        toast.warning(message, { duration, position, icon });
        break;
      case 'info':
      default:
        toast(message, { duration, position, icon });
        break;
    }
  }, [message, type, duration, position, icon]);

  return null; // Prevent multiple Toaster renders
};

// Render Toaster once in your app's entry point
export const ToastProvider = () => <Toaster richColors />;

const defaultToastConfig: Partial<ToastProps> = {
  duration: 5000,
  position: 'top-center',
};

export const showToast = (props: ToastProps) => {
  const {
    message,
    type = 'info',
    duration = 4000,
    position = 'top-center',
    icon,
  } = props;

  switch (type) {
    case 'success':
      toast.success(message, { duration, position, icon });
      break;
    case 'error':
      toast.error(message, { duration, position, icon });
      break;
    case 'warning':
      toast.warning(message, { duration, position, icon });
      break;
    case 'info':
    default:
      toast(message, { duration, position, icon });
      break;
  }
};
