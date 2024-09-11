'use server';
import { Card } from '@/components/ui/card';
import {
  getCompanyUsersForReports,
  getDeviceData,
  getCpuData,
  getOsData,
  getBrowserData,
} from '@/data/user';
import { DailyUsersChart, PieChartComponent } from '../components/users/charts';
import { UsersCards } from '../components/users/usersCards';
import { auth } from '@/auth';

export default async function ReportsPage() {
  const session = await auth();
  const result = await getCompanyUsersForReports({
    orderBy: 'asc',
    id: session?.user.cid,
    filter: 'all',
  });

  const users = result?.users || [];
  const totalCount = users.length;
  // Calculate counts based on the fetched companies
  const activeCount = users.filter((user) => user.is_active).length;
  const inactiveCount = users.filter((user) => !user.is_active).length;
  const adminCount = users.filter((user) => user.role === 'ADMIN').length;
  const userCount = users.filter((user) => user.role === 'USER').length;
  const dailyActiveUsers = result?.dailyActiveUsers || [];
  const deviceData = await getDeviceData();
  const cpuData = await getCpuData();
  const osData = await getOsData();
  const browserData = await getBrowserData();

  return (
    <section className="h-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Reports</h1>

        <UsersCards
          totalCount={totalCount}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          adminCount={adminCount}
          userCount={userCount}
        />

        <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Daily Active Users
          </h2>
          <div className="h-80">
            <DailyUsersChart dailyActiveUsers={dailyActiveUsers} />
          </div>
        </Card>
        <Card className="p-6 flex flex-row bg-white dark:bg-gray-800 rounded-lg shadow space-x-4 mb-8">
          <Card className="p-6  flex flex-col w-1/3 bg-white dark:bg-gray-800 dark:border-gray-600 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Most used browser
            </h2>
            <div className="h-80">
              <PieChartComponent data={browserData} />
            </div>
          </Card>
          <Card className="p-6 flex flex-col w-1/3 bg-white dark:bg-gray-800 dark:border-gray-600  rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Most used OS
            </h2>
            <div className="h-80">
              <PieChartComponent data={osData} />
            </div>
          </Card>
          <Card className="p-6 flex flex-colflex flex-col w-1/3 bg-white dark:bg-gray-800  dark:border-gray-600 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Most used browser
            </h2>
            <div className="h-80">
              <PieChartComponent data={browserData} />
            </div>
          </Card>
        </Card>
      </div>
    </section>
  );
}
