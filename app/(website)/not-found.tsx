import Link from 'next/link';

const NotFound = () => {
  return (
    <div>
      <h1>Not found – 404!</h1>
      <div>
        <Link href="/">Go back to Home</Link>
      </div>
    </div>
  );
};
export default NotFound;
