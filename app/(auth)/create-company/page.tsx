import type { Metadata } from 'next';

import CompanyForm from '../../../components/auth/company-form';

export const metadata: Metadata = {
  title: 'Create Company',
};

const CreateCompanyPage = () => {
  return <CompanyForm />;
};

export default CreateCompanyPage;
