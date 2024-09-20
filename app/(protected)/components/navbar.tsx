'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import React, { useMemo } from 'react';

import ThemeSwitch from '@/components/themeSwtich';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import LocaleSwitcher from '@/components/ui/localSwitcher';
import Logo from '@/public/small-light.png';

import ProfileDropDown from './profile-dropdown';

const navigation = [
  {
    name: 'Visitors',
    href: '/visitors',
    isAdmin: false,
    isSaOnly: false,
    visibleToAll: true,
  },
  {
    name: 'Users',
    href: '/admin/users',
    isAdmin: true,
    isSaOnly: false,
    visibleToAll: false,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    isAdmin: true,
    isSaOnly: false,
    visibleToAll: false,
  },
  {
    name: 'Reports',
    href: '/reports',
    isAdmin: true,
    isSaOnly: false,
    visibleToAll: false,
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    isAdmin: false,
    isSaOnly: true,
    visibleToAll: false,
  },
  {
    name: 'Companies',
    href: '/companies',
    isAdmin: false,
    isSaOnly: true,
    visibleToAll: false,
  },
];

const userNavigation = [
  { name: 'Your Profile', href: '/profile-settings' },
  { name: 'Sign out', onClick: () => signOut() },
];

interface AdminNavBarProps {
  session: Session;
}

export const AdminNavBar = ({ session }: AdminNavBarProps) => {
  const pathname = usePathname();
  const userRole = session.user.role;

  const isCurrentPage = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const filteredNavigation = useMemo(() => {
    return navigation.filter((item) => {
      if (item.visibleToAll) return true;
      if (userRole === 'SUPERADMIN') return true;
      if (userRole === 'ADMIN') return item.isAdmin && !item.isSaOnly;
      return !item.isAdmin && !item.isSaOnly;
    });
  }, [userRole]);

  return (
    <div className="min-h-full">
      <Disclosure
        as="nav"
        className="fixed top-0 z-50 w-full bg-gradient-to-r from-gray-900 to-black shadow-md"
      >
        {() => {
          return (
            <>
              <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 shrink-0">
                      <Avatar
                        image={session.user.company.logo}
                        name={session.user.company.companyName}
                        contextType="navbar"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {filteredNavigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                            className={clsx(
                              isCurrentPage(item.href)
                                ? 'bg-white font-semibold text-black'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <ThemeSwitch />
                    <LocaleSwitcher />
                    <ProfileDropDown session={session} />
                  </div>
                </div>
              </div>

              <DisclosurePanel className="md:hidden">
                <div className="z-50 space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {filteredNavigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as={Link}
                      href={item.href}
                      aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                      className={clsx(
                        isCurrentPage(item.href)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium',
                      )}
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="shrink-0">
                      {session.user.image ? (
                        <Image
                          alt="Profile Image"
                          src={session.user.image || Logo}
                          className="size-8 rounded-full"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <div className="shrink-0">
                          <div className="flex size-8 items-center justify-center rounded-full border-2 border-gray-300 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-lg font-bold text-gray-800 shadow-lg">
                            {session?.user?.name
                              ? session?.user?.name[0].toUpperCase()
                              : 'S'}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {session.user.name}
                      </div>
                      <div className="pt-2 text-sm font-medium leading-none text-gray-400">
                        {session.user.role}
                      </div>
                    </div>
                    <Button
                      type="button"
                      className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    />
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) =>
                      item.href ? (
                        <DisclosureButton
                          key={item.name}
                          as={Link}
                          href={item.href}
                          onClick={item.onClick}
                          className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          {item.name}
                        </DisclosureButton>
                      ) : (
                        <DisclosureButton
                          key={item.name}
                          as={Button}
                          onClick={item.onClick}
                          className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          {item.name}
                        </DisclosureButton>
                      ),
                    )}
                  </div>
                </div>
              </DisclosurePanel>
            </>
          );
        }}
      </Disclosure>
    </div>
  );
};

export default React.memo(AdminNavBar);
