import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (
  date: Date | string,
  formatType: string = 'MMM dd, yyyy hh:mm a',
) => {
  return format(new Date(date), formatType);
};

export const calculateRemainingDays = (fromdate: string): number => {
  const today = new Date();
  const expireDate = new Date(fromdate);
  const timeDiff = expireDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return Math.max(0, daysDiff);
};
