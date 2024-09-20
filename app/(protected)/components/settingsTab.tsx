import * as Tabs from '@radix-ui/react-tabs';

import CompanySettingsPage from '../admin/settings/(.)company-settings/page';
import SubscriptionPage from '../admin/settings/(.)subscription/page';

const SettingsTab = () => (
  <div className="flex min-h-screen flex-col bg-white transition-colors duration-300 dark:bg-gray-900 md:flex-row">
    <Tabs.Root
      defaultValue="tab1"
      orientation="vertical"
      className="flex h-auto w-full overflow-hidden md:h-screen"
    >
      {/* Sidebar List */}
      <Tabs.List
        className="fixed z-40 flex h-auto w-full flex-col space-y-2 border-r border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800 md:h-screen md:w-1/6 lg:w-1/6" // Updated for responsiveness
        aria-label="Manage your account"
      >
        <Tabs.Trigger
          className="flex items-center  justify-between rounded-lg p-3 text-sm  font-bold text-gray-600 transition-colors duration-200 ease-in-out hover:bg-gray-200 data-[state=active]:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-700 dark:data-[state=active]:bg-gray-600"
          value="tab1"
        >
          Subscription
        </Tabs.Trigger>
        <Tabs.Trigger
          className="flex items-center justify-between rounded-lg p-3 text-sm font-bold text-gray-600 transition-colors duration-200 ease-in-out hover:bg-gray-200 data-[state=active]:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-700 dark:data-[state=active]:bg-gray-600"
          value="tab2"
        >
          Domain Settings
        </Tabs.Trigger>
      </Tabs.List>

      {/* Content Area */}
      <div className="h-auto flex-1 overflow-y-auto bg-white p-4 transition-colors duration-300 dark:bg-gray-900 max-sm:mt-[10%] md:ml-16 md:h-screen md:p-6  lg:ml-[17%]">
        <Tabs.Content value="tab2">
          <CompanySettingsPage />
        </Tabs.Content>
        <Tabs.Content value="tab1">
          <SubscriptionPage />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  </div>
);

SettingsTab.displayName = 'SettingsTab';
export default SettingsTab;
