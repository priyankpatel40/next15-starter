import { v4 as uuidv4 } from 'uuid';

import { Card } from './card';

const items = [...Array(5)].map(() => ({ id: uuidv4() }));

const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export const UserTableSkeleton = () => {
  return (
    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div
                  className={`${shimmer} size-10 rounded-full bg-gray-300 dark:bg-gray-600`}
                />
                <div className="ml-3">
                  <div className={`${shimmer} h-4 w-24 bg-gray-300 dark:bg-gray-600`} />
                  <div
                    className={`${shimmer} mt-1 h-3 w-32 bg-gray-300 dark:bg-gray-600`}
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
        <div className="h-6 w-1/3 rounded bg-gray-300" />
        <div className="h-4 w-1/4 rounded bg-gray-300" />
        <div className="h-4 w-1/5 rounded bg-gray-300" />
        <div className="h-4 w-1/6 rounded bg-gray-300" />
      </div>
    </div>
  );
};
export const CardCountSkeleton = () => {
  return (
    <Card className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="mb-4 flex items-center">
        <div className="mr-4 size-12 animate-pulse rounded bg-gray-300" />
        <div className="h-6 w-32 animate-pulse rounded bg-gray-300" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-700">
          <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-300" />
          <div className="h-10 w-24 animate-pulse rounded bg-gray-300" />
        </div>
        <div className="rounded-lg bg-green-100 p-4 text-center dark:bg-green-400">
          <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-300" />
          <div className="h-10 w-24 animate-pulse rounded bg-gray-300" />
        </div>
        <div className="rounded-lg bg-red-100 p-4 text-center dark:bg-red-400">
          <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-300" />
          <div className="h-10 w-24 animate-pulse rounded bg-gray-300" />
        </div>
      </div>
    </Card>
  );
};
