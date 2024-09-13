'use server';

import SettingsTab from '../../components/settingsTab';

const SettingsPage = async () => {
  return (
    <section className="h-full py-0">
      <SettingsTab />
    </section>
  );
};

export default SettingsPage;
