// components/allUsers.tsx

'use server';

import { UsersIcon } from '@heroicons/react/24/outline';
import type { User } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { auth } from '@/auth';
import FilterSelect from '@/components/ui/filterselect';
import { UserTableSkeleton } from '@/components/ui/skeletons';
import TextSearch from '@/components/ui/textSearch';
import { getCompanyUsers } from '@/data/user';
import logger from '@/lib/logger';
import type { UsersTableArray } from '@/utils/types';

import AddUserButton from './addUserButton';
import UsersCards from './usersCards';
import AllUsersTable from './usersTable';

interface AllUsersProps {
  searchParams: { page?: string; filter?: string; query?: string };
}

const AllUsers = async ({ searchParams }: AllUsersProps) => {
  const session = await auth();
  const t = await getTranslations('UsersPage');
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
  const users: UsersTableArray = (result?.users || []).map((user) => ({
    ...user,
    name: user.name ?? 'User', // Default to 'User' if name is null
    creatorName: user.creatorName ?? 'User', // Default to 'User' if creatorName is null
    image: user.image ?? '', // Default to empty string if image is null
  }));
  const totalCount = users.length;
  const activeCount = users.filter((user) => user.isActive).length;
  const inactiveCount = users.filter((user) => !user.isActive).length;
  const adminCount = users.filter((user) => user.role === 'ADMIN').length;
  const userCount = users.filter((user) => user.role === 'USER').length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleUserAdded = (user: User) => {
    'use server';

    logger.info('🚀 ~ handleUserAdded ~ user:', user);
    revalidatePath('/admin/users');
    redirect('/admin/users');
  };

  return (
    <div className="mx-auto w-full  px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-center sm:justify-start">
          <div className="mr-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-400 p-0.5 shadow-lg dark:from-gray-700 dark:to-gray-900">
            <div className="rounded-full bg-white p-3 dark:bg-gray-800">
              <UsersIcon className="size-6 text-gray-800 dark:text-gray-200" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('subTitle')}</p>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="p-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-stretch lg:space-x-4 lg:space-y-0">
            <div className="w-full lg:w-auto">
              <UsersCards
                totalCount={totalCount}
                activeCount={activeCount}
                inactiveCount={inactiveCount}
                adminCount={adminCount}
                userCount={userCount}
              />
            </div>
            <div className="flex grow flex-col  justify-center space-y-4 lg:flex-row lg:space-x-4 lg:space-y-5">
              <div className="grow lg:mt-5">
                <TextSearch placeholder={t('placeholder')} />
              </div>
              <div className="w-full lg:w-auto">
                <FilterSelect filter={filter} />
              </div>
              <div className="w-full lg:w-auto">
                <AddUserButton onUserAdded={handleUserAdded} />
              </div>
            </div>
          </div>
        </div>
        <Suspense key={users.length} fallback={<UserTableSkeleton />}>
          <AllUsersTable
            users={users} // This should be UsersTableArray
            page={page}
            itemsPerPage={itemsPerPage}
            totalCount={totalCount}
            totalPages={totalPages}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default AllUsers;
