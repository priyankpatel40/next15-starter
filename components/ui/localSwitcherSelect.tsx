'use client';

import { CheckIcon, LanguageIcon } from '@heroicons/react/24/solid';
import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import { useTransition } from 'react';

import type { Locale } from '@/i18n/config';
import { setUserLocale } from '@/utils/locale';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({ defaultValue, items, label }: Props) {
  const [isPending, startTransition] = useTransition();
  const tooltipText = `Select ${label}`;

  const handleValueChange = (value: string) => {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  return (
    <div className="group relative">
      <Select.Root defaultValue={defaultValue} onValueChange={handleValueChange}>
        <Select.Trigger
          aria-label={label}
          className={clsx(
            'rounded-full p-2 transition-colors  hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-600',
            isPending && 'pointer-events-none opacity-60',
          )}
        >
          <Select.Icon>
            <LanguageIcon className="size-5 text-gray-400 transition-colors hover:text-gray-800 dark:text-gray-300" />
          </Select.Icon>
        </Select.Trigger>
        <span className="absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:inline-block dark:bg-gray-200 dark:text-black">
          {tooltipText}
          <span className="absolute right-[-6px] top-1/2 translate-y-[-50%] border-4 border-transparent border-l-gray-800 dark:border-l-gray-200" />
        </span>
        <Select.Portal>
          <Select.Content
            align="end"
            className="z-50 min-w-32 overflow-hidden rounded-md border border-gray-300 bg-white py-1 shadow-lg transition-transform hover:scale-105 dark:border-gray-600 dark:bg-gray-800"
            position="popper"
          >
            <Select.Viewport>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  className="flex cursor-pointer items-center p-2 text-sm text-gray-900 transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600"
                  value={item.value}
                >
                  <div className="mr-2 w-4">
                    {item.value === defaultValue && (
                      <CheckIcon className="size-5 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <span>{item.label}</span>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.Arrow className="fill-white transition-transform duration-200 ease-in-out dark:fill-gray-800" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
