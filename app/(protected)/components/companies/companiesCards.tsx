import { Card } from '@/components/ui/card';

export const CompaniesCards = ({
  totalCount,
  activeCount,
  inactiveCount,
  trialCount,
  nonTrialCount,
}: {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  trialCount: number;
  nonTrialCount: number;
}) => {
  const cardClasses =
    'flex flex-col items-center justify-between p-3 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';

  return (
    <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-3 lg:grid-cols-5">
      <Card className={cardClasses}>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Total
        </span>
        <span className="text-xl font-bold text-customGray-600 dark:text-blue-300 mt-1">
          {totalCount.toLocaleString()}
        </span>
      </Card>
      <Card className={cardClasses}>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Active
        </span>
        <span className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
          {activeCount.toLocaleString()}
        </span>
      </Card>
      <Card className={cardClasses}>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Inactive
        </span>
        <span className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
          {inactiveCount.toLocaleString()}
        </span>
      </Card>
      <Card className={cardClasses}>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Trial
        </span>
        <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
          {trialCount.toLocaleString()}
        </span>
      </Card>
      <Card className={cardClasses}>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Subscribed
        </span>
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
          {nonTrialCount.toLocaleString()}
        </span>
      </Card>
    </div>
  );
};
