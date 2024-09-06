import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 dark:text-red-400">
      <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
};
