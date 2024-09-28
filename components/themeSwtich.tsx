'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

import { Button } from './ui/button';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const tooltipText = `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'}`;

  return (
    <div className="group relative">
      <Button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        aria-label={tooltipText}
        className="rounded-full bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        {resolvedTheme === 'dark' ? (
          <FiSun size={20} className="size-5 text-yellow-500" />
        ) : (
          <FiMoon
            size={20}
            className=" size-5 text-gray-400 hover:text-gray-800 dark:text-gray-300"
          />
        )}
      </Button>
      <span className="absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:inline-block dark:bg-gray-200 dark:text-black">
        {tooltipText}
        <span className="absolute right-[-6px] top-1/2 translate-y-[-50%] border-4 border-transparent border-l-gray-800 dark:border-l-gray-200" />
      </span>
    </div>
  );
}
