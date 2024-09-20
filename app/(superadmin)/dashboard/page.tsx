'use server';

import { Suspense } from 'react';

import {
  CompaniesCard,
  SubscriptionsCard,
  UsersCard,
} from '@/app/(protected)/components/companies/dashboardCards';
import {
  DailyCompaniesChart,
  DailyUsersChart,
} from '@/app/(protected)/components/users/charts';
import { Card } from '@/components/ui/card';
import { CardCountSkeleton } from '@/components/ui/skeletons';
import {
  getAllCompaniesforDashboard,
  getAllCompanyUsersForReports,
} from '@/data/company';

export default async function DashboardPage() {
  const users = await getAllCompanyUsersForReports({
    filter: 'all',
  });
  const totalUsers = users.totalCount;
  const activeUsers = users.activeCount;
  const inactiveUsers = users.inactiveCount;
  const { dailyActiveUsers } = users;

  const companiesresult = await getAllCompaniesforDashboard({
    orderBy: 'asc',
    filter: 'all',
  });

  const { companies } = companiesresult;
  const totalCompanies = companiesresult.totalCount;
  const activeCompanies = companiesresult.activeCount;
  const inactiveCompanies = companiesresult.inactiveCount;
  const { dailyActiveCompanies } = companiesresult;
  const { dailyLoginActivity } = users;
  const { activeSubscriptions } = companiesresult;
  const { inactiveSubscriptions } = companiesresult;
  const totalSubscriptions = activeSubscriptions + inactiveSubscriptions;

  return (
    <section className="h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Suspense key={companies.length} fallback={<CardCountSkeleton />}>
            <CompaniesCard
              totalCompanies={totalCompanies}
              activeCompanies={activeCompanies}
              inactiveCompanies={inactiveCompanies}
            />
          </Suspense>

          <SubscriptionsCard
            activeSubscriptions={activeSubscriptions}
            inactiveSubscriptions={inactiveSubscriptions}
            totalSubscriptions={totalSubscriptions}
          />
          <UsersCard
            totalUsers={totalUsers}
            totalActiveUsers={activeUsers}
            totalInactiveUsers={inactiveUsers}
          />
        </div>

        <Card className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Daily Newly Created Companies
          </h2>
          <div className="h-80">
            <Suspense
              key={dailyActiveCompanies.length}
              fallback={<p>Loading companies data...</p>}
            >
              <DailyCompaniesChart dailyActiveCompanies={dailyActiveCompanies} />
            </Suspense>
          </div>
        </Card>
        <Card className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Daily Newly Created Users
          </h2>
          <div className="h-80">
            <Suspense
              key={dailyActiveUsers.length}
              fallback={<p>Loading users data...</p>}
            >
              <DailyUsersChart dailyActiveUsers={dailyActiveUsers} />
            </Suspense>
          </div>
        </Card>
        <Card className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Daily Logged In Users
          </h2>

          <div className="h-80">
            <Suspense
              key={dailyLoginActivity.length}
              fallback={<p>Loading login data...</p>}
            >
              <DailyUsersChart dailyActiveUsers={dailyLoginActivity} />
            </Suspense>
          </div>
        </Card>

        <Card className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Recent Companies
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-300 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Company Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                  )
                  .slice(0, 5)
                  .map((company) => (
                    <tr
                      key={company.id}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {company.companyName}
                      </td>
                      <td className="px-6 py-4">
                        {company.isActive ? 'Active' : 'Inactive'}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}
