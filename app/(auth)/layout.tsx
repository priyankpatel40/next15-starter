import ThemeSwitch from '@/components/themeSwtich';
import LocaleSwitcher from '@/components/ui/localSwitcher';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-auto min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] relative">
      <div className="absolute top-4 right-12 flex space-x-4">
        <ThemeSwitch />
        <LocaleSwitcher />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
