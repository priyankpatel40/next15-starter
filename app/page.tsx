import 'animate.css';

import { GitHubLogoIcon } from '@radix-ui/react-icons';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FcDeployment } from 'react-icons/fc';

import ThemeSwitch from '@/components/themeSwtich';
import BackgroundImage from '@/components/ui/background';
import { Button } from '@/components/ui/button';
import ITEMS from '@/components/ui/items';

export const metadata: Metadata = {
  title: 'Next.js Enterprise Boilerplate',
  twitter: {
    card: 'summary_large_image',
  },
  openGraph: {
    url: 'https://next-enterprise.vercel.app/',
    images: [
      {
        width: 1200,
        height: 630,
        url: 'https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png',
      },
    ],
  },
};

export default function Web() {
  return (
    <>
      <section className="animate__animated animate__fadeIn bg-gradient-to-r from-gray-900 to-gray-700 transition duration-500 ease-in-out dark:from-gray-800 dark:to-gray-600">
        <div className="mx-auto flex items-center justify-end p-4">
          <Link
            href="/login"
            className="mr-4 text-lg text-white transition duration-300 hover:text-gray-300 hover:underline"
          >
            View Demo
          </Link>
          <div className="flex items-center">
            <ThemeSwitch />
          </div>
        </div>
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="animate__animated animate__fadeIn mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl xl:text-6xl">
              Next.js Enterprise Starter Kit
            </h1>
            <p className="animate__animated animate__fadeIn animate__delay-1s mb-6 max-w-2xl font-light text-gray-200 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              Kickstart your enterprise-grade project with our robust, secure, and
              scalable Next.js 15 boilerplate! Equipped with advanced authentication,
              seamless Stripe integration, internationalization support, and optimized for
              high performance. Enjoy rapid UI development and comprehensive type checking
              with TypeScript.
            </p>
            <div className="flex justify-center space-x-3">
              <Button className="flex items-center rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-6 py-3 text-lg text-black transition-transform hover:from-green-500 hover:to-blue-600">
                <GitHubLogoIcon className="mr-2 size-6" />
                <Link href="https://github.com/priyankpatel40/next15-starter">
                  Get started
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-lg border  border-gray-300 text-gray-800 transition-transform hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                <FcDeployment className="mr-2 size-6" />
                <Link href="https://vercel.com/new/git/external?repository-url=https://github.com/priyankpatel40/next15-starter">
                  Deploy Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div>
        <BackgroundImage />
      </div>

      <section className="bg-white transition duration-500 ease-in-out dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
          <h2 className="animate__animated animate__fadeIn mb-8 text-center text-2xl font-bold dark:text-white">
            Features
          </h2>
          <div className="justify-center space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
            {ITEMS.map((singleItem, index) => (
              <div
                key={singleItem.title}
                className="animate__animated animate__zoomIn flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4 text-center shadow-lg transition-transform hover:scale-105 dark:bg-gray-800 dark:shadow-gray-800"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="animate__animated animate__fadeInRight mb-4 flex size-10 items-center justify-center rounded-full bg-gray-200 p-1.5 text-black dark:bg-gray-100 lg:size-12">
                  {singleItem.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">
                  {singleItem.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {singleItem.description}
                </p>
                {singleItem.comingSoon && (
                  <span className="mt-2 rounded-full bg-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
