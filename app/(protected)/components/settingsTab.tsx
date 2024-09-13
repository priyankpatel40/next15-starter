import * as Tabs from '@radix-ui/react-tabs';
import CompanySettingsPage from '../admin/settings/(.)company-settings/page';
import SubscriptionPage from '../admin/settings/(.)subscription/page';

const SettingsTab = () => (
  <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <Tabs.Root defaultValue="tab1" orientation="vertical" className="flex w-full">
      {/* Sidebar List */}
      <Tabs.List
        className="sticky top-0 flex flex-col p-4 space-y-2 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto" // Adjusted height to h-screen and added sticky positioning
        aria-label="Manage your account"
      >
        {/* Tab Triggers */}
        <Tabs.Trigger
          className="flex items-center justify-between p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 ease-in-out data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-600"
          value="tab1"
        >
          Domain Settings
        </Tabs.Trigger>
        <Tabs.Trigger
          className="flex items-center justify-between p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 ease-in-out data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-600"
          value="tab2"
        >
          Subscription
        </Tabs.Trigger>
      </Tabs.List>

      {/* Content Area */}
      <div className="flex-1 p-6 bg-white dark:bg-gray-900 transition-colors duration-300 overflow-y-auto h-screen">
        {' '}
        {/* Adjusted to allow vertical scroll */}
        <Tabs.Content value="tab1">
          <CompanySettingsPage />
        </Tabs.Content>
        <Tabs.Content value="tab2">
          <SubscriptionPage />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  </div>
);

SettingsTab.displayName = 'SettingsTab';
export default SettingsTab;
