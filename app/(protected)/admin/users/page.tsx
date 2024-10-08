import type { Metadata } from 'next';

import AllUsers from '../../components/users/allusers';

export const metadata: Metadata = {
  title: 'Users',
};

export default function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; filter?: string; query?: string };
}) {
  return (
    <section className="h-full px-4 py-6 sm:px-6 lg:px-8">
      <AllUsers searchParams={searchParams} />
    </section>
  );
}
