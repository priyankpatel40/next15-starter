import type { Metadata } from 'next';

import SettingsTab from '../../components/settingsTab';

export const metadata: Metadata = {
  title: 'Settings',
};

const SettingsPage = async () => {
  return (
    <section className="h-full py-0">
      <SettingsTab />
    </section>
  );
};

export default SettingsPage;
