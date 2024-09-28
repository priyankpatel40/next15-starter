import 'animate.css';

import ITEMS from './items';

const Features = () => {
  return (
    <div className="bg-gray-50 py-16 dark:bg-gray-900 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 sm:text-4xl">
            Features
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {ITEMS.map((singleItem, index) => (
            <div
              key={singleItem.title}
              className="animate__animated animate__fadeIn flex flex-col items-center justify-between rounded-2xl bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl dark:bg-gray-800 dark:shadow-gray-800"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                {singleItem.icon}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {singleItem.title}
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  {singleItem.description}
                </p>
              </div>
              {singleItem.comingSoon && (
                <span className="mt-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400 sm:text-4xl">
            and many more...
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Features;
