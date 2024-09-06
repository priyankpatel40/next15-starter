import clsx from 'clsx';
import Image from 'next/image';

export const Avatar = ({
  image,
  name,
  contextType,
}: {
  image: string;
  name: string;
  contextType: string;
}) => {
  return (
    <div className="flex-shrink-0">
      {image ? (
        <Image
          src={image}
          alt={`${name} avatar`}
          className="w-10 h-10 rounded-full"
          width={40}
          height={40}
        />
      ) : (
        <div className="flex-shrink-0">
          <div
            className={clsx(
              'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg',
              contextType === 'profile'
                ? 'border-2 border-gray-300 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-800'
                : 'border-2 border-blue-300 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 text-blue-800',
            )}
          >
            {name ? name[0].toUpperCase() : contextType === 'profile' ? 'P' : 'C'}
          </div>
        </div>
      )}
    </div>
  );
};
