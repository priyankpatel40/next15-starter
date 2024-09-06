const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export const UserTableSkeleton = () => {
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      {/* <thead className="text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="p-4">
            User
          </th>
          <th scope="col" className="px-6 py-3">
            Role
          </th>
          <th scope="col" className="px-6 py-3">
            Status
          </th>
          <th scope="col" className="px-6 py-3">
            Last Login
          </th>
          <th scope="col" className="px-6 py-3">
            Added by
          </th>
          <th scope="col" className="px-6 py-3">
            Actions
          </th>
        </tr>
      </thead> */}
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
