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

const BackgroundImage = () => {
  return (
    <div className="relative h-auto bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 py-4">
      <div className="flex flex-wrap items-center justify-center px-4">
        {logos.map((logo) => (
          <div
            key={logo.src}
            className="m-2 flex w-1/12 items-center justify-center sm:w-1/2 md:w-1/5 lg:w-1/12"
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

export default BackgroundImage;
