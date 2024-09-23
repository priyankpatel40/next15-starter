import * as Tabs from '@radix-ui/react-tabs';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { auth } from '@/auth';
import { getUserById } from '@/data/user';

import ChangePasswordForm from '../components/change-password';
import ProfileForm from '../components/profile-form';

export const metadata: Metadata = {
  title: 'Profile Settings',
};

const ProfileSettingsPage = async () => {
  const session = await auth();
  const t = await getTranslations('ProfilePage');
  const userId = session?.user?.id;
  const user = await getUserById(userId);
  if (!user) {
    return (
      <div>
        <p>User not found or not authenticated.</p>
      </div>
    );
  }
  return (
    <div className="flex justify-center bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 md:p-8">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800 sm:max-w-lg md:max-w-2xl">
        <Tabs.Root defaultValue="tab1">
          <Tabs.List
            className="flex border-b border-gray-200 dark:border-gray-700"
            aria-label="Manage your account"
          >
            <Tabs.Trigger
              className="flex-1 px-6 py-4 text-sm font-medium text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-700 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black dark:text-gray-400 dark:hover:text-gray-200 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400"
              value="tab1"
            >
              {t('account')}
            </Tabs.Trigger>
            <Tabs.Trigger
              className="flex-1 px-6 py-4 text-sm font-medium text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-700 focus:outline-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black dark:text-gray-400 dark:hover:text-gray-200 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400"
              value="tab2"
            >
              {t('password')}
            </Tabs.Trigger>
          </Tabs.List>
          <div className="p-6">
            <Tabs.Content value="tab1">
              <ProfileForm
                name={user.name}
                email={user.email}
                isTwoFactorEnabled={user.isTwoFactorEnabled}
                isOAuth={session.isOAuth || false}
              />
            </Tabs.Content>
            <Tabs.Content value="tab2">
              <ChangePasswordForm isOAuth={session.isOAuth} />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
