import ThemeSwitch from '@/components/themeSwtich';
import LocaleSwitcher from '@/components/ui/localSwitcher';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]">
      <div className="absolute right-12 top-4 flex space-x-4">
        <ThemeSwitch />
        <LocaleSwitcher />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
