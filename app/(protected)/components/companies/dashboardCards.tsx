'use client';

import { BuildingOfficeIcon, UsersIcon } from '@heroicons/react/24/outline';

import { Card } from '@/components/ui/card';

export const CompaniesCard = ({
  totalCompanies,
  activeCompanies,
  inactiveCompanies,
}: {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
}) => {
  return (
    <Card className="rounded-lg bg-white p-6 shadow transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
      <div className="mb-4 flex items-center">
        <BuildingOfficeIcon className="mr-4 size-12 text-blue-500" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Companies
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-700">
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Total
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalCompanies}
          </p>
        </div>
        <div className="rounded-lg bg-green-100 p-4 text-center dark:bg-green-400">
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Active
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {activeCompanies}
          </p>
        </div>
        <div className="rounded-lg bg-red-100 p-4 text-center dark:bg-red-400">
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Inactive
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {inactiveCompanies}
          </p>
        </div>
      </div>
    </Card>
  );
};

export const SubscriptionsCard = ({
  totalSubscriptions,
  activeSubscriptions,
  inactiveSubscriptions,
}: {
  totalSubscriptions: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
}) => {
  return (
    <Card className="rounded-lg bg-white p-6 shadow transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
      <div className="mb-4  flex items-center">
        <BuildingOfficeIcon className="mr-4 size-12 text-blue-500" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Subscriptions
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-100 p-4 text-center dark:bg-gray-700">
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Subscribed
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {activeSubscriptions}
          </p>
        </div>
        <div className="rounded-lg bg-yellow-100 p-4 text-center dark:bg-green-400">
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            On Trial
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {inactiveSubscriptions}
          </p>
        </div>
        <div className="rounded-lg bg-gray-100 p-4 text-center dark:bg-red-400">
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Total
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalSubscriptions}
          </p>
        </div>
      </div>
    </Card>
  );
};

export const UsersCard = ({
  totalUsers,
  totalActiveUsers,
  totalInactiveUsers,
}: {
  totalUsers: number;
  totalActiveUsers: number;
  totalInactiveUsers: number;
}) => {
  return (
    <Card className="rounded-lg bg-white p-6 shadow transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
      <div className="mb-4 flex items-center">
        <UsersIcon className="mr-4 size-12 text-blue-500" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-700">
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Total
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
        </div>
        <div className="rounded-lg bg-green-100 p-4 text-center dark:bg-green-400">
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Active
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalActiveUsers}
          </p>
        </div>
        <div className="rounded-lg bg-red-100 p-4 text-center dark:bg-red-400">
          <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Inactive
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalInactiveUsers}
          </p>
        </div>
      </div>
    </Card>
  );
};
