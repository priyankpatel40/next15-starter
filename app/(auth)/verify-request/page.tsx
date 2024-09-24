import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CardWrapper } from '@/components/auth/card-wrapper';

export const metadata: Metadata = {
  title: 'Verification',
};

const VerifyRequestPage = async () => {
  const t = await getTranslations('VerifyRequestPage');

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8 ">
      <CardWrapper
        headerLabel={t('title')}
        backButtonLabel={t('backButtonLabel')}
        backButtonHref="/login"
        cardClasses="w-full max-w-md shadow-lg"
      >
        <div>
          <h2 className="text-center">{t('headerLabel')}</h2>
        </div>
      </CardWrapper>
    </div>
  );
};

export default VerifyRequestPage;
