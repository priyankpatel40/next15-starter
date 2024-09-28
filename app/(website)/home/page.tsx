import 'animate.css';

import { GitHubLogoIcon } from '@radix-ui/react-icons';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FcDeployment } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import Features from '@/components/ui/features';
import TechStack from '@/components/ui/techStack';

export const metadata: Metadata = {
  title: 'NextJS 15 Enterprise Starter Kit',
  twitter: {
    card: 'summary_large_image',
  },
  openGraph: {
    url: process.env.NEXT_PUBLIC_APP_URL,
    images: [
      {
        width: 1200,
        height: 630,
        url: '../public/logo-light.png',
      },
    ],
  },
};

const HomePage = () => {
  return (
    <div className="pt-16 dark:bg-gray-900">
      <section className="animate__animated animate__fadeIn bg-[#fafafa] bg-contain bg-right-top bg-no-repeat pb-14 transition duration-500 ease-in-out dark:bg-[#fafafa] lg:bg-custom-bg">
        <div className=" mx-auto px-4 py-8 lg:py-24">
          <div className="flex flex-col items-start text-left">
            {' '}
            {/* Ensure text is left-aligned */}
            <h1 className="animate__animated animate__bounceInUp mb-4 text-4xl font-extrabold leading-tight tracking-tight text-black  md:text-5xl xl:text-6xl">
              Next.js Enterprise Starter Kit
            </h1>
            <h2 className="mb-4 py-4 text-2xl font-extrabold text-black md:text-3xl">
              Launch Your Enterprise Product{' '}
              <span className="animate-pulse-glow rounded-md bg-gradient-to-r from-orange-500 to-pink-500 px-2 text-white">
                In Hours
              </span>{' '}
              with Next.js Starter Kit
            </h2>
            <p className="text-md mb-6 flex items-center text-black md:text-lg">
              Accelerate your development process with our robust and scalable starter kit
              designed for enterprise applications.
            </p>
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <Button className="flex items-center rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-6 py-3 text-lg text-white transition-transform hover:from-green-500 hover:to-blue-600">
                <GitHubLogoIcon className="mr-2 size-6" />
                <Link
                  href="https://github.com/priyankpatel40/next15-starter"
                  className="hover:underline"
                >
                  Get started
                </Link>
              </Button>

              <Button
                variant="outline"
                className="flex items-center rounded-lg border border-gray-300 px-6 py-3 text-lg text-gray-800 transition-transform hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                <FcDeployment className="mr-2 size-6" />
                <Link
                  href="https://vercel.com/new/git/external?repository-url=https://github.com/priyankpatel40/next15-starter"
                  className="hover:underline"
                >
                  Deploy Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div>
        <TechStack />
      </div>

      <section className="bg-white transition duration-500 ease-in-out dark:bg-gray-900">
        <Features />
      </section>
      {/* <section className="bg-white transition duration-500 ease-in-out dark:bg-gray-900">
        <WhyBlock />
      </section> */}
      {/* <section className="bg-white transition duration-500 ease-in-out dark:bg-gray-900">
        <FaqSection />
      </section> */}
    </div>
  );
};

export default HomePage;
