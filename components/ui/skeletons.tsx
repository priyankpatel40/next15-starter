import { Card } from './card';

const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export const UserTableSkeleton = () => {
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr
            key={index}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div
                  className={`${shimmer} h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600`}
                />
                <div className="ml-3">
                  <div className={`${shimmer} h-4 w-24 bg-gray-300 dark:bg-gray-600`} />
                  <div
                    className={`${shimmer} h-3 w-32 mt-1 bg-gray-300 dark:bg-gray-600`}
                  />
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className={`${shimmer} h-4 w-16 bg-gray-300 dark:bg-gray-600`} />
            </td>
            <td className="px-6 py-4">
              <div className={`${shimmer} h-4 w-16 bg-gray-300 dark:bg-gray-600`} />
            </td>
            <td className="px-6 py-4">
              <div className={`${shimmer} h-4 w-24 bg-gray-300 dark:bg-gray-600`} />
            </td>
            <td className="px-6 py-4">
              <div className={`${shimmer} h-4 w-16 bg-gray-300 dark:bg-gray-600`} />
            </td>
            <td className="px-6 py-4">
              <div className={`${shimmer} h-4 w-16 bg-gray-300 dark:bg-gray-600`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const ProductListSkeleton = () => {
  return (
    <div className="flex justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/5"></div>
        <div className="h-4 bg-gray-300 rounded w-1/6"></div>
      </div>
    </div>
  );
};
export const CardCountSkeleton = () => {
  return (
    <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 bg-gray-300 rounded animate-pulse mr-4" />
        <div className="h-6 w-32 bg-gray-300 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse mb-1" />
          <div className="h-10 w-24 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="bg-green-100 dark:bg-green-400 p-4 rounded-lg text-center">
          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse mb-1" />
          <div className="h-10 w-24 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="bg-red-100 dark:bg-red-400 p-4 rounded-lg text-center">
          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse mb-1" />
          <div className="h-10 w-24 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
};
