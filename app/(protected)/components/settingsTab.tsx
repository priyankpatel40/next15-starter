import * as Tabs from '@radix-ui/react-tabs';
import CompanySettingsPage from '../admin/settings/(.)company-settings/page';
import SubscriptionPage from '../admin/settings/(.)subscription/page';

const SettingsTab = () => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 md:flex-row">
    <Tabs.Root
      defaultValue="tab1"
      orientation="vertical"
      className="flex w-full h-auto md:h-screen overflow-hidden"
    >
      {/* Sidebar List */}
      <Tabs.List
        className="flex fixed z-50 flex-col p-4 space-y-2 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-auto md:h-screen md:w-1/6 w-full lg:w-1/6" // Updated for responsiveness
        aria-label="Manage your account"
      >
        <Tabs.Trigger
          className="flex items-center justify-between p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 ease-in-out data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-600"
          value="tab1"
        >
          Subscription
        </Tabs.Trigger>
        <Tabs.Trigger
          className="flex items-center justify-between p-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 ease-in-out data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-600"
          value="tab2"
        >
          Domain Settings
        </Tabs.Trigger>
      </Tabs.List>

      {/* Content Area */}
      <div className="flex-1 lg:ml-[17%] p-4 md:p-6 bg-white dark:bg-gray-900 transition-colors duration-300 h-auto md:h-screen overflow-y-auto md:ml-1/6 lg:ml-1/6">
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
