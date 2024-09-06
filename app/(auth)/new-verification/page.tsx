import { NewVerificationForm } from '@/components/auth/new-verification-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verification',
};

const NewVerificationPage = () => {
  return <NewVerificationForm />;
};

export default NewVerificationPage;
