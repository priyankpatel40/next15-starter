import type { ExtendedUser } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const useCurrentUser = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      if (session && session.user) {
        setUser(session.user as ExtendedUser); // Cast session.user to ExtendedUser
      }
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [session, status]);

  if (status === 'loading') {
    return null;
  }

  return user;
};

export default useCurrentUser;
