'use server';
import { Card } from '@/components/ui/card';

import {
  getAllCompaniesforDashboard,
  getAllCompanyUsersForReports,
} from '@/data/company';
import {
  CompaniesCard,
  SubscriptionsCard,
  UsersCard,
} from '@/app/(protected)/components/companies/dashboardCards';
import {
  DailyCompaniesChart,
  DailyUsersChart,
} from '@/app/(protected)/components/users/charts';

export default async function DashboardPage() {
  const users = await getAllCompanyUsersForReports({
    orderBy: 'desc',
    filter: 'all',
  });
  const totalUsers = users.totalCount;
  const activeUsers = users.activeCount;
  const inactiveUsers = users.inactiveCount;
  const dailyActiveUsers = users.dailyActiveUsers;

  const companiesresult = await getAllCompaniesforDashboard({
    orderBy: 'asc',
    filter: 'all',
  });
  const companies = companiesresult.companies;
  const totalCompanies = companiesresult.totalCount;
  const activeCompanies = companiesresult.activeCount;
  const inactiveCompanies = companiesresult.inactiveCount;
  const dailyActiveCompanies = companiesresult.dailyActiveCompanies;
  const activeSubscriptions = companiesresult.activeSubscriptions;
  const inactiveSubscriptions = companiesresult.inactiveSubscriptions;
  const totalSubscriptions = activeSubscriptions + inactiveSubscriptions;

  return (
    <section className="h-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CompaniesCard
            totalCompanies={totalCompanies}
            activeCompanies={activeCompanies}
            inactiveCompanies={inactiveCompanies}
          />

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

        <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Daily Active Companies
          </h2>
          <div className="h-80">
            <DailyCompaniesChart dailyActiveCompanies={dailyActiveCompanies} />
          </div>
        </Card>
        <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Daily Active Users
          </h2>
          <div className="h-80">
            <DailyUsersChart dailyActiveUsers={dailyActiveUsers} />
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Companies
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
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
                      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                  )
                  .slice(0, 5)
                  .map((company) => (
                    <tr
                      key={company.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {company.company_name}
                      </td>
                      <td className="px-6 py-4">
                        {company.is_active ? 'Active' : 'Inactive'}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(company.created_at).toLocaleDateString()}
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
