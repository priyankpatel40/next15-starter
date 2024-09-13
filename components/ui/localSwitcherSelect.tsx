'use client';

import { CheckIcon, LanguageIcon } from '@heroicons/react/24/solid';
import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import { useTransition } from 'react';
import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/utils/locale';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({ defaultValue, items, label }: Props) {
  const [isPending, startTransition] = useTransition();
  const tooltipText = `Select ${label}`;

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="relative group">
      <Select.Root defaultValue={defaultValue} onValueChange={onChange}>
        <Select.Trigger
          aria-label={label}
          className={clsx(
            'rounded-full p-2 transition-colors  dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-600',
            isPending && 'pointer-events-none opacity-60',
          )}
        >
          <Select.Icon>
            <LanguageIcon className="h-5 w-5 text-gray-400 dark:text-gray-300 hover:text-gray-800 transition-colors" />
          </Select.Icon>
        </Select.Trigger>
        <span className="absolute hidden group-hover:inline-block bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded py-1 px-2 top-full left-1/2 transform -trangray-x-1/2 mt-2 whitespace-nowrap">
          {tooltipText}
          <span className="absolute bottom-full left-1/2 transform -trangray-x-1/2 border-4 border-transparent border-b-gray-800 dark:border-b-gray-200"></span>
        </span>
        <Select.Portal>
          <Select.Content
            align="end"
            className="min-w-[8rem] z-50 overflow-hidden rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg border border-gray-300 dark:border-gray-600 transition-transform transform hover:scale-105"
            position="popper"
          >
            <Select.Viewport>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  className="flex cursor-pointer items-center px-2 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ease-in-out"
                  value={item.value}
                >
                  <div className="mr-2 w-[1rem]">
                    {item.value === defaultValue && (
                      <CheckIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <span>{item.label}</span>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.Arrow className="fill-white dark:fill-gray-800 transition-transform duration-200 ease-in-out" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
