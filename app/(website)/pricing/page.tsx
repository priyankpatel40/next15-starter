import Link from 'next/link';

const PricingPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center text-center">
      <h2 className="mb-4 text-3xl font-bold">Pricing of Speculum</h2>
      <p className="mb-6 text-lg">Coming Soon...</p>
      <Link
        href="/"
        className="rounded-md bg-black px-4 py-2 text-lg text-white transition duration-300 hover:bg-gray-700"
      >
        Return Home
      </Link>
    </div>
  );
};

export default PricingPage;
