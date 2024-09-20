import { useLocale, useTranslations } from 'next-intl';

import LocaleSwitcherSelect from '@/components/ui/localSwitcherSelect';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: 'en',
          label: t('en'),
        },
        {
          value: 'de',
          label: t('de'),
        },
        {
          value: 'fr',
          label: t('fr'),
        },
        {
          value: 'es',
          label: t('es'),
        },
      ]}
      label={t('label')}
    />
  );
}
