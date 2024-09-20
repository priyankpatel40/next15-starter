import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { CardWrapper } from '@/components/auth/card-wrapper';

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/login"
      backButtonLabel="Back to login"
      cardClasses=""
    >
      <div className="flex w-full items-center justify-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
export default ErrorCard;
