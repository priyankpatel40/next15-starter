import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import LogoLight from '../../public/logo-light.png';
import LogoDark from '../../public/logo-dark.png';

// const font = Poppins({
//   subsets: ['latin'],
//   weight: ['600'],
// });

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a default logo (light) when the theme is not yet resolved
  const logoSrc = !mounted || resolvedTheme === 'light' ? LogoLight : LogoDark;

  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <Image
        src={logoSrc}
        alt={`${resolvedTheme || 'default'} theme logo`}
        width={200}
        height={200}
        className="mx-auto"
      />
      <p className="text-muted-foreground text-lg">{label}</p>
    </div>
  );
};
