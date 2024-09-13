import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success',
};

const PaymentCancelPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-2xl font-bold">PaymentCancelPage </h1>
    </div>
  );
};

export default PaymentCancelPage;
