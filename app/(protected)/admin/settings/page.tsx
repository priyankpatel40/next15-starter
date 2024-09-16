import SettingsTab from '../../components/settingsTab';
import { Metadata } from 'next';
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
