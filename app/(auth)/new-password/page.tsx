import type { Metadata } from 'next';

import NewPasswordForm from '@/components/auth/new-password-form';

export const metadata: Metadata = {
  title: 'New Password',
};

const NewPasswordPage = () => {
  return <NewPasswordForm />;
};

export default NewPasswordPage;
