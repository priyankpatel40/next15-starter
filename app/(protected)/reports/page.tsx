'use server';

import { getTranslations } from 'next-intl/server';

import { auth } from '@/auth';
import { Card } from '@/components/ui/card';
import {
  getBrowserData,
  getCompanyUsersForReports,
  getDeviceData,
  getOsData,
} from '@/data/user';

import { DailyUsersChart, PieChartComponent } from '../components/users/charts';
import UsersCards from '../components/users/usersCards';

export default async function ReportsPage() {
  const session = await auth();
  const t = await getTranslations('ReportsPage');
  const result = await getCompanyUsersForReports({
    orderBy: 'asc',
    id: session?.user.cid,
    filter: 'all',
  });

  const users = result?.users || [];
  const totalCount = users.length;
  // Calculate counts based on the fetched companies
  const activeCount = users.filter((user) => user.isActive).length;
  const inactiveCount = users.filter((user) => !user.isActive).length;
  const adminCount = users.filter((user) => user.role === 'ADMIN').length;
  const userCount = users.filter((user) => user.role === 'USER').length;
  const dailyActiveUsers = result?.dailyActiveUsers || [];
  const deviceData = await getDeviceData();
  const osData = await getOsData();
  const browserData = await getBrowserData();

  return (
    <section className="h-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full ">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>

        <UsersCards
          totalCount={totalCount}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          adminCount={adminCount}
          userCount={userCount}
        />

        <Card className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {t('dailyUsers')}
          </h2>
          <div className="h-80">
            <DailyUsersChart dailyActiveUsers={dailyActiveUsers} />
          </div>
        </Card>
        <Card className="mb-8 flex flex-row space-x-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <Card className="mb-8  flex w-1/3 flex-col rounded-lg bg-white p-6 shadow dark:border-gray-600 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {t('browser')}
            </h2>
            <div className="h-80">
              <PieChartComponent data={browserData} />
            </div>
          </Card>
          <Card className="mb-8 flex w-1/3 flex-col rounded-lg bg-white p-6  shadow dark:border-gray-600 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {t('os')}
            </h2>
            <div className="h-80">
              <PieChartComponent data={osData} />
            </div>
          </Card>
          <Card className="mb-8 flex w-1/3 flex-col rounded-lg bg-white p-6 shadow dark:border-gray-600 dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {t('devices')}
            </h2>
            <div className="h-80">
              <PieChartComponent data={deviceData} />
            </div>
          </Card>
        </Card>
      </div>
    </section>
  );
}
