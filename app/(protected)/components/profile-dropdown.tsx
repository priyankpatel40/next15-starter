'use client';

import {
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import type { Session } from 'next-auth';

import { logout } from '@/actions/logout';
import { Button } from '@/components/ui/button';
import Logo from '@/public/default-user.png';

interface ProfileDropDownProps {
  session: Session;
}

const ProfileDropDown = ({ session }: ProfileDropDownProps) => {
  const logoutHandler = () => {
    logout();
  };

  return (
    <>
      <div className="hidden md:block">
        <div className="flex items-center md:ml-2">
          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton className="relative flex max-w-xs items-center px-4 py-2  text-sm hover:bg-gray-700 hover:text-white">
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
                  <div className="shrink-0">
                    <div className="flex size-10 items-center justify-center rounded-full border-2 border-gray-300 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-lg font-bold text-gray-800 shadow-lg">
                      {session?.user?.name ? session?.user?.name[0].toUpperCase() : 'S'}
                    </div>
                  </div>
                )}
                <div className="ml-2 flex flex-col items-start text-white">
                  <span className="text-sm font-medium">{session?.user?.name}</span>
                  <span className="text-[10px] text-gray-400">{session?.user?.role}</span>
                </div>
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black transition focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <MenuItem key="Profile Settings">
                <Link
                  href="/profile-settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:underline data-[focus]:bg-gray-100"
                >
                  Profile Settings
                </Link>
              </MenuItem>
              <MenuItem key="Logout">
                <Button
                  variant="link"
                  onClick={logoutHandler}
                  className="block w-full  px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </Button>
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
            className="block size-6 group-data-[open]:hidden"
          />
          <XMarkIcon
            aria-hidden="true"
            className="hidden size-6 group-data-[open]:block"
          />
        </DisclosureButton>
      </div>
    </>
  );
};

export default ProfileDropDown;
