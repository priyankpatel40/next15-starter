import clsx from 'clsx';
import Image from 'next/image';

const Avatar = ({
  image,
  name,
  contextType,
}: {
  image: string | '';
  name: string;
  contextType: string;
}) => {
  const getInitial = () => {
    if (name && name.length > 0) {
      return name.charAt(0).toUpperCase();
    }
    return contextType === 'profile' ? 'P' : 'C';
  };
  return (
    <div className="shrink-0">
      {image ? (
        <Image
          src={image}
          alt={`${name} avatar`}
          className="size-10 rounded-full"
          width={40}
          height={40}
        />
      ) : (
        <div className="shrink-0">
          <div
            className={clsx(
              'flex size-10 items-center justify-center rounded-full text-lg font-bold shadow-lg',
              contextType === 'profile'
                ? 'border-2 border-gray-300 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-800'
                : 'border-2 border-blue-300 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 text-blue-800',
            )}
          >
            {getInitial()}
          </div>
        </div>
      )}
    </div>
  );
};
export default Avatar;
