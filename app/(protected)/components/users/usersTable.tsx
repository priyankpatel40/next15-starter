'use client';

import {
  InformationCircleIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { type User, UserRole } from '@prisma/client';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import Avatar from '@/components/ui/avatar';
import { formatDate } from '@/utils/helpers';
import type { UsersTableArray } from '@/utils/types';

import Pagination from '../pagination';
import { EditUserLink, UserStatusLink } from './tableLinks';

export default function AllUsersTable({
  users: initialUsers,
  page,
  itemsPerPage,
  totalCount,
  totalPages,
}: {
  users: UsersTableArray;
  page: number;
  itemsPerPage: number;
  totalCount: number;
  totalPages: number;
}) {
  const [users, setUsers] = useState(initialUsers);
  const router = useRouter();
  const t = useTranslations('UsersPage.UserTable');
  const g = useTranslations('General');

  const handleStatusChange = (id: string, newStatus: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === id ? { ...user, isActive: newStatus } : user)),
    );
    router.refresh();
  };

  const handleUserUpdated = (updatedUser: Partial<User>) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id
          ? {
              ...user,
              name: updatedUser.name ?? user.name,
              email: updatedUser.email ?? user.email,
              role: updatedUser.role ?? user.role,
              isActive: updatedUser.isActive ?? user.isActive,
              isTwoFactorEnabled:
                updatedUser.isTwoFactorEnabled ?? user.isTwoFactorEnabled,
            }
          : user,
      ),
    );
    router.refresh();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-300 text-sm uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="w-[30%] p-4">
                {t('user')}
              </th>
              <th scope="col" className="w-[15%] p-2">
                {t('role')}
              </th>
              <th scope="col" className="w-[15%] p-2">
                {t('status')}
              </th>
              <th scope="col" className="w-1/4 p-2">
                {t('addedBy')}
              </th>
              <th scope="col" className="w-[15%] p-2">
                2FA
              </th>
              <th scope="col" className="w-[10%] p-2">
                {t('action')}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="group border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar image={user.image} name={user.name} contextType="profile" />
                    <div className="flex max-w-[calc(100%-3rem)] flex-col">
                      <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </span>
                      <div className="flex items-center">
                        <span className="truncate text-xs text-gray-500">
                          {user.email}
                        </span>
                        {user.emailVerified === null && (
                          <div className="group relative">
                            <InformationCircleIcon className="ml-1 size-4 text-orange-500" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              {t('pending')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap p-2">
                  {user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN ? (
                    <div className="flex w-20 items-center space-x-0 rounded-md border border-blue-300 bg-blue-100">
                      <div className="rounded-full bg-blue-100 p-1.5">
                        <ShieldCheckIcon className="size-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-blue-600">Admin</span>
                    </div>
                  ) : (
                    <div className="flex w-20 items-center space-x-0 rounded-md border border-gray-300 bg-gray-100">
                      <div className="rounded-full bg-gray-100 p-1.5">
                        <UserIcon className="size-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {t('user')}
                      </span>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap p-2 font-medium text-gray-900 dark:text-white">
                  <span
                    className={clsx(
                      'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                      user.isActive
                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                        : 'bg-gray-50 text-gray-700 ring-gray-700',
                    )}
                  >
                    {user.isActive ? `${g('active')}` : `${g('inActive')}`}
                  </span>
                </td>
                <td className="whitespace-nowrap p-2 font-medium dark:text-white">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {user.creatorName || 'System'}
                      </span>
                      <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <svg
                          className="mr-1 size-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap p-2 font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <div className="relative ">
                      <div className="flex items-center space-x-2 rounded-lg bg-white p-1">
                        <span
                          className={`text-xs font-semibold ${
                            user.isTwoFactorEnabled ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {user.isTwoFactorEnabled
                            ? `${g('enabled')}`
                            : `${g('disabled')}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap p-2 font-medium text-gray-900 dark:text-white">
                  <div className="flex space-x-4 opacity-100 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="relative">
                      <EditUserLink userData={user} onUserUpdated={handleUserUpdated} />
                    </div>

                    <div className="relative">
                      <UserStatusLink
                        status={user.isActive}
                        id={user.id}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={totalPages}
        page={page}
        itemsPerPage={itemsPerPage}
        totalCount={totalCount}
      />
    </>
  );
}
