// BackgroundImage.js
import Image from 'next/image';

const logos = [
  { src: '/logos/nextjs.svg', alt: 'Next.js Logo' },
  { src: '/logos/authjs.svg', alt: 'Auth.js Logo' },
  { src: '/logos/prisma.svg', alt: 'Prisma Logo' },
  { src: '/logos/stripe.svg', alt: 'Stripe Logo' },
  { src: '/logos/next-intl.svg', alt: 'Next Intl Logo', width: '100' },
  { src: '/logos/tailwind.png', alt: 'Tailwind Logo' },
  { src: '/logos/typescript.svg', alt: 'TypeScript Logo' },
];

const BackgroundImage = () => {
  return (
    <div className="relative h-20 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 md:h-20">
      <div className="flex flex-wrap items-center justify-center px-4 md:px-16">
        {logos.map((logo) => (
          <div
            key={logo.src}
            className="m-2 max-w-xs shrink-0 items-center justify-center px-16"
          >
            <Image
              src={logo.src}
              width={Number(logo.width) || 50} // Increased size
              height={50} // Increased size
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
