import Image from 'next/image';

const logos = [
  { src: '/logos/nextjs.svg', alt: 'Next.js Logo' },
  { src: '/logos/authjs.svg', alt: 'Auth.js Logo' },
  { src: '/logos/prisma.svg', alt: 'Prisma Logo' },
  { src: '/logos/stripe.svg', alt: 'Stripe Logo' },
  { src: '/logos/next-intl.svg', alt: 'Next Intl Logo', width: '100' },
  { src: '/logos/tailwind.png', alt: 'Tailwind Logo' },
  { src: '/logos/typescript.svg', alt: 'TypeScript Logo' },
  { src: '/logos/zod.svg', alt: 'zod Logo' },
];

const TechStack = () => {
  return (
    <div className="relative h-auto bg-gradient-to-r from-[#7073cc] to-[#0fc399] py-8">
      <p className="animate__animated animate__fadeIn animate__delay-1s mb-6 items-center justify-center text-center font-light text-white md:text-lg lg:mb-8 lg:text-xl">
        Kickstart your enterprise-grade project with our robust, secure, and scalable
        Next.js 15 boilerplate! Equipped with advanced authentication, seamless Stripe
        integration, internationalization support, and optimized for high performance.
        Enjoy rapid UI development and comprehensive type checking with TypeScript.
      </p>

      <div className="flex flex-wrap items-center justify-center px-4">
        {logos.map((logo, index) => (
          <div
            key={logo.src}
            className="animate__animated animate__fadeIn m-2 flex w-1/12 items-center justify-center sm:w-1/2 md:w-1/5 lg:w-1/12"
            style={{ animationDelay: `${index * 0.2}s` }} // Staggered delay
          >
            <Image
              src={logo.src}
              width={Number(logo.width) || 50} // Default logo width
              height={50} // Default logo height
              alt={logo.alt}
              className="m-auto transition duration-300 ease-in-out hover:scale-110 hover:animate-pulse"
              aria-label={logo.alt} // Accessibility enhancement
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
