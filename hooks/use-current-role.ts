import type { ExtendedUser } from 'next-auth';
import { useSession } from 'next-auth/react';

const useCurrentRole = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (session.user as ExtendedUser).role || null; // Use the ExtendedUser type
  }

  return null;
};

export default useCurrentRole;
