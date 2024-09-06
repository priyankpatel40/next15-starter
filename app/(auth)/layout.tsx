import ThemeSwitch from '@/components/themeSwtich';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-auto min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] relative">
      <div className="absolute top-4 right-12">
        <ThemeSwitch />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
