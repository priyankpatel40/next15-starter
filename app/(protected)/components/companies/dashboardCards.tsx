'use client';
import { Card } from '@/components/ui/card';
import { UsersIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

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
    <>
      <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <BuildingOfficeIcon className="h-12 w-12 text-blue-500 mr-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Companies
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalCompanies}
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-400 p-4 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Active
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeCompanies}
            </p>
          </div>
          <div className="bg-red-100 dark:bg-red-400 p-4 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Inactive
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {inactiveCompanies}
            </p>
          </div>
        </div>
      </Card>
    </>
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
    <>
      <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
        <div className="flex  items-center mb-4">
          <BuildingOfficeIcon className="h-12 w-12 text-blue-500 mr-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Subscriptions
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Subscribed
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeSubscriptions}
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-green-400 p-4 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              On Trial
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {inactiveSubscriptions}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-red-400 p-4 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalSubscriptions}
            </p>
          </div>
        </div>
      </Card>
    </>
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
    <>
      <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <UsersIcon className="h-12 w-12 text-blue-500 mr-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalUsers}
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-400 p-4 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Active
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalActiveUsers}
            </p>
          </div>
          <div className="bg-red-100 dark:bg-red-400 p-4 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Inactive
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalInactiveUsers}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};
