'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
// import LocaleSwitcher from '@/components/ui/localSwitcher';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import LogoDark from '../../public/logo-dark.png';
import LogoLight from '../../public/logo-light.png';
import ThemeSwitch from '../themeSwtich';

const navigation = [
  {
    name: 'Home',
    href: '/home',
  },
  {
    name: 'Pricing',
    href: '/pricing',
  },
  {
    name: 'Contact',
    href: '/contact',
  },
  {
    name: 'View demo',
    href: '/login',
  },
];

const NavBarMenu = () => {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a default logo (light) when the theme is not yet resolved
  const logoSrc = !mounted || resolvedTheme === 'light' ? LogoLight : LogoDark;
  const isCurrentPage = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="max-h-16">
      <Disclosure
        as="nav"
        className="fixed top-0 z-50 w-full bg-white shadow-md dark:bg-black"
      >
        {() => {
          return (
            <>
              <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 shrink-0">
                      <Link href="/home">
                        <Image
                          src={logoSrc}
                          width={200}
                          height={200}
                          alt={`${resolvedTheme || 'default'} theme logo`}
                          aria-label="Logo"
                          className="animate__animated animate__lightSpeedInLeft"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-end space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                            className={clsx(
                              isCurrentPage(item.href)
                                ? ' bg-black font-semibold text-white dark:bg-white dark:text-black'
                                : 'text-gray-900 hover:bg-gray-700 hover:text-white dark:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <ThemeSwitch />
                    {/* <LocaleSwitcher /> */}
                    <div className="-mr-2 flex md:hidden">
                      {/* Mobile menu button */}
                      <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md  p-2 text-gray-800 hover:bg-gray-400 hover:text-white focus:outline-none focus:ring-2 dark:bg-black dark:text-white dark:hover:bg-gray-800  ">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon
                          aria-hidden="true"
                          className="block size-6 group-data-[open]:hidden"
                        />
                        <XMarkIcon
                          aria-hidden="true"
                          className="hidden size-6 group-data-[open]:block"
                        />
                      </DisclosureButton>
                    </div>
                  </div>
                </div>
              </div>

              <DisclosurePanel className="md:hidden">
                <div className="z-50 space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as={Link}
                      href={item.href}
                      aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                      className={clsx(
                        isCurrentPage(item.href)
                          ? 'bg-gray-900 text-white'
                          : 'text-black hover:bg-gray-700 hover:text-white dark:text-white',
                        '123 block rounded-md px-3 py-2 text-base font-medium',
                      )}
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                </div>
              </DisclosurePanel>
            </>
          );
        }}
      </Disclosure>
    </div>
  );
};

export default React.memo(NavBarMenu);
