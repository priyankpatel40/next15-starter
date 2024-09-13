'use client';

import { FiSun, FiMoon } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const tooltipText = `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`;

  return (
    <div className="relative group">
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        aria-label={tooltipText}
        className="p-2 rounded-full dark:border-gray-600  dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {resolvedTheme === 'dark' ? (
          <FiSun size={20} className="h-5 w-5 text-yellow-500" />
        ) : (
          <FiMoon
            size={20}
            className=" h-5 w-5 text-gray-400 dark:text-gray-300 hover:text-gray-800"
          />
        )}
      </button>
      <span className="absolute hidden group-hover:inline-block bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded py-1 px-2 top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
        {tooltipText}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800 dark:border-b-gray-200"></span>
      </span>
    </div>
  );
}
