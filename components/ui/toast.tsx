'use client';

import { toast, Toaster } from 'sonner';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  icon?: React.ReactNode; // Adjusted to allow more flexibility
}

// Render Toaster once in your app's entry point
export const ToastProvider = () => <Toaster richColors />;

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
