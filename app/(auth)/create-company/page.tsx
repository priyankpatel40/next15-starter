import { CompanyForm } from '../../../components/auth/company-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Company',
};

const CreateCompanyPage = () => {
  return <CompanyForm />;
};

export default CreateCompanyPage;
