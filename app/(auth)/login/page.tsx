import type { Metadata } from 'next';

import LoginForm from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Login',
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
