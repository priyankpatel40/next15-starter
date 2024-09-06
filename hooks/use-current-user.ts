import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const useCurrentUser = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      setUser(session.user);
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [session, status]);

  if (status === 'loading') {
    return null;
  }

  return user;
};
