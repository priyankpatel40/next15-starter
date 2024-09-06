'use client';
import { Avatar } from '@/components/ui/avatar';
import clsx from 'clsx';
import { ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/utils/helpers';
import Pagination from '../pagination';
import { EditUserLink, UserStatusLink } from './tableLinks';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@prisma/client';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface FormattedUsersTable {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  creatorName: string;
  created_at: string;
  isTwoFactorEnabled: boolean;
  emailVerified: Date | null;
}
export default function AllUsersTable({
  users: initialUsers,
  page,
  itemsPerPage,
  totalCount,
  totalPages,
  onUpdateCompany,
  currentUser,
}: {
  users: FormattedUsersTable[];
  page: number;
  itemsPerPage: number;
  totalCount: number;
  totalPages: number;
  onUpdateCompany: (id: string, data: Partial<FormattedUsersTable>) => Promise<void>;
  currentUser: User;
}) {
  const [users, setUsers] = useState(initialUsers);
  const router = useRouter();

  const handleStatusChange = (id: string, newStatus: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, is_active: newStatus } : user,
      ),
    );
    router.refresh();
  };
  const handleDelete = (id: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
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
              is_active: updatedUser.is_active ?? user.is_active,
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
        <table className="w-full min-w-[800px] text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-sm text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4 w-[30%]">
                User
              </th>
              <th scope="col" className="p-2 w-[15%]">
                Role
              </th>
              <th scope="col" className="p-2 w-[15%]">
                Status
              </th>
              <th scope="col" className="p-2 w-[25%]">
                Added by
              </th>
              <th scope="col" className="p-2 w-[15%]">
                2FA
              </th>
              <th scope="col" className="p-2 w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar image={user.image} name={user.name} contextType="profile" />
                    <div className="flex flex-col max-w-[calc(100%-3rem)]">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                        {user.emailVerified === null && (
                          <div className="relative group">
                            <InformationCircleIcon className="w-4 h-4 ml-1 text-orange-500" />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                              Email verification pending by the user
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-2 whitespace-nowrap">
                  {user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN ? (
                    <div className="flex bg-blue-100 border border-blue-300 w-20 rounded-md items-center space-x-0">
                      <div className="p-1.5 bg-blue-100 rounded-full">
                        <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-blue-600">Admin</span>
                    </div>
                  ) : (
                    <div className="flex bg-gray-100 border border-gray-300 w-20 rounded-md items-center space-x-0">
                      <div className="p-1.5 bg-gray-100 rounded-full">
                        <UserIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">User</span>
                    </div>
                  )}
                </td>
                <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <span
                    className={clsx(
                      'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                      user.is_active
                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                        : 'bg-gray-50 text-gray-700 ring-gray-700',
                    )}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-2 font-medium whitespace-nowrap dark:text-white">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {user.creatorName || 'System'}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <svg
                          className="w-3 h-3 mr-1"
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
                        {formatDate(user.created_at)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center">
                    <div className="relative ">
                      <div className="flex items-center space-x-2 p-1 bg-white rounded-lg">
                        <span
                          className={`text-xs font-semibold ${
                            user.isTwoFactorEnabled ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {user.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex space-x-4 opacity-100 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="relative">
                      <EditUserLink userData={user} onUserUpdated={handleUserUpdated} />
                    </div>

                    <div className="relative">
                      <UserStatusLink
                        status={user.is_active}
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
