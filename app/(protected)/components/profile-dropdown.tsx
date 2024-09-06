'use client';
import {
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';

import Image from 'next/image';
import Logo from '@/public/default-user.png';
import { Session } from 'next-auth';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { logout } from '@/actions/logout';
import Link from 'next/link';
import { useEffect } from 'react';

interface ProfileDropDownProps {
  session: Session;
}

export const ProfileDropDown = ({ session }: ProfileDropDownProps) => {
  const logoutHandler = () => {
    logout();
  };

  return (
    <>
      <div className="hidden md:block">
        <div className="flex items-center md:ml-2">
          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton className="relative px-4 py-2 flex max-w-xs items-center  text-sm hover:bg-gray-700 hover:text-white">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                {session.user.image ? (
                  <Image
                    alt="Profile Image"
                    src={session.user.image || Logo}
                    className="rounded-full"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center text-gray-800 font-bold text-lg shadow-lg">
                      {session?.user?.name ? session?.user?.name[0].toUpperCase() : 'S'}
                    </div>
                  </div>
                )}
                <div className="text-white ml-2 flex flex-col items-start">
                  <span className="text-sm font-medium">{session?.user?.name}</span>
                  <span className="text-[10px] text-gray-400">{session?.user?.role}</span>
                </div>
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <MenuItem key="Profile Settings">
                <Link
                  href="/profile-settings"
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                >
                  Profile Settings
                </Link>
              </MenuItem>
              <MenuItem key="Logout">
                <button
                  onClick={logoutHandler}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
      <div className="-mr-2 flex md:hidden">
        {/* Mobile menu button */}
        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="absolute -inset-0.5" />
          <span className="sr-only">Open main menu</span>
          <Bars3Icon
            aria-hidden="true"
            className="block h-6 w-6 group-data-[open]:hidden"
          />
          <XMarkIcon
            aria-hidden="true"
            className="hidden h-6 w-6 group-data-[open]:block"
          />
        </DisclosureButton>
      </div>
    </>
  );
};
