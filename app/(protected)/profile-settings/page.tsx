import { Metadata } from 'next';
import { ProfileForm } from '../components/profile-form';
import { ChangePasswordForm } from '../components/change-password';
import { auth } from '@/auth';

import { getUserById } from '@/data/user';
import * as Tabs from '@radix-ui/react-tabs';

export const metadata: Metadata = {
  title: 'Profile Settings',
};

const ProfileSettingsPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const user = await getUserById(userId);
  return (
    <div className="flex justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <Tabs.Root defaultValue="tab1">
          <Tabs.List
            className="flex border-b border-gray-200 dark:border-gray-700"
            aria-label="Manage your account"
          >
            <Tabs.Trigger
              className="flex-1 px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200 ease-in-out data-[state=active]:text-black dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-blue-400"
              value="tab1"
            >
              Account
            </Tabs.Trigger>
            <Tabs.Trigger
              className="flex-1 px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200 ease-in-out data-[state=active]:text-black dark:data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-blue-400"
              value="tab2"
            >
              Password
            </Tabs.Trigger>
          </Tabs.List>
          <div className="p-6">
            <Tabs.Content value="tab1">
              <ProfileForm user={user} />
            </Tabs.Content>
            <Tabs.Content value="tab2">
              <ChangePasswordForm user={user} />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
