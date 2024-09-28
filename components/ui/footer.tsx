import { LinkedInLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const FooterLink = ({ href, text }: { href: string; text: string }) => (
  <div className="px-5 py-2">
    <a
      href={href}
      className="text-base leading-6 text-gray-600 transition-colors duration-300 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    >
      {text}
    </a>
  </div>
);

const SocialLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactElement;
}) => (
  <Link
    href={href}
    className=" text-gray-500 transition-colors duration-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
  >
    <span className="sr-only">{label}</span>
    {icon}
  </Link>
);

const FooterComponent = () => (
  <footer className="bg-gray-100 dark:bg-gray-800">
    <div className="mx-auto max-w-screen-xl space-y-8 overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <nav className="-mx-5 -my-2 flex flex-wrap justify-center">
        <FooterLink href="/about" text="About" />
        <FooterLink href="/pricing" text="Pricing" />
        <FooterLink href="contact" text="Contact" />
        <FooterLink href="terms" text="Terms" />
      </nav>

      <div className="mt-8 flex justify-center space-x-6 ">
        <SocialLink
          href="https://www.linkedin.com/in/priyankpatel2828/"
          label="LinkedIn"
          icon={<LinkedInLogoIcon />}
        />
        <SocialLink href="https://x.com/ppriyank40" label="X" icon={<FaTwitter />} />
        <SocialLink href="https://x.com/ppriyank40" label="X" icon={<FaGithub />} />
      </div>
    </div>
  </footer>
);

export default FooterComponent;
