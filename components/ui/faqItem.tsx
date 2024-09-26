const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
  <div className="py-5">
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-gray-900 dark:text-white">
        <span>{question}</span>
        <span className="transition group-open:rotate-180">
          <svg
            fill="none"
            height="24"
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>
      <p className="group-open:animate-fadeIn mt-3 text-gray-600 dark:text-gray-300">
        {answer}
      </p>
    </details>
  </div>
);

export default FAQItem;
