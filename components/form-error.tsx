import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
      <ExclamationTriangleIcon className="size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
};
