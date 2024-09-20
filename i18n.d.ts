import 'next-intl';

import type { MyType } from './locales/en.json';

declare module 'next-intl' {
  export type Messages = typeof MyType;
}
