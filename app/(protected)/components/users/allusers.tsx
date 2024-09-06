'use server';
import { getCompanyUsers } from '@/data/user';
import { Suspense } from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';
import { User } from '@prisma/client';
import { UserTableSkeleton } from '@/components/ui/skeletons';
import AllUsersTable from '../../components/users/usersTable';
import TextSearch from '@/components/ui/textSearch';
import FilterSelect from '@/components/ui/filterselect';
import { AddUserButton } from '../../components/users/addUserButton';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UsersCards } from '../../components/users/usersCards';
export const AllUsers = async ({
  searchParams,
}: {
  searchParams: { page?: string; filter?: string; query?: string };
}) => {
  const session = await auth();
  //console.log("🚀 ~ UsersPage ~ session:", session);
  const page = Number(searchParams.page) || 1;
  const filter = searchParams.filter || 'all';
  const search = searchParams.query || '';
  const itemsPerPage = 10;

  const result = await getCompanyUsers({
    page,
    itemsPerPage,
    orderBy: 'asc',
    filter,
    search,
    cid: session?.user.cid,
  });

  const users = result?.users || [];
  const totalCount = users.length;
  // Calculate counts based on the fetched companies
  const activeCount = users.filter((user) => user.is_active).length;
  const inactiveCount = users.filter((user) => !user.is_active).length;
  const adminCount = users.filter((user) => user.role === 'ADMIN').length;
  const userCount = users.filter((user) => user.role === 'USER').length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleUserAdded = (user: User) => {
    'use server';
    console.log('🚀 ~ file: page.tsx:154 ~ handleUserAdded ~ user:', user);
    revalidatePath('/admin/users');
    redirect('/admin/users');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-center sm:justify-start">
          <div className="bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 p-0.5 rounded-full shadow-lg mr-4">
            <div className="bg-white dark:bg-gray-800 rounded-full p-3">
              <UsersIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Company Users
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and oversee all users within your organization
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-stretch space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-auto">
              <UsersCards
                totalCount={totalCount}
                activeCount={activeCount}
                inactiveCount={inactiveCount}
                adminCount={adminCount}
                userCount={userCount}
              />
            </div>
            <div className="flex flex-col lg:flex-row  flex-grow space-y-4 lg:space-y-5 lg:space-x-4 justify-center">
              <div className="flex-grow lg:mt-5">
                <TextSearch placeholder="Search by name" />
              </div>
              <div className="w-full lg:w-auto">
                <FilterSelect filter={filter} />
              </div>
              <div className="w-full lg:w-auto">
                <AddUserButton
                  currentUser={session?.user}
                  onUserAdded={handleUserAdded}
                />
              </div>
            </div>
          </div>
        </div>
        <Suspense key={users} fallback={<UserTableSkeleton />}>
          <AllUsersTable
            users={users}
            page={page}
            currentUser={session?.user}
            itemsPerPage={itemsPerPage}
            totalCount={totalCount}
            totalPages={totalPages}
            onUpdateUser={handleUserAdded}
          />
        </Suspense>
      </div>
    </div>
  );
};
