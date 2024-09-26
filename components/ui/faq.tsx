import FAQItem from './faqItem';

const FaqSection = () => {
  return (
    <div className="relative mt-8 w-full bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-100/5 sm:mx-auto sm:rounded-lg sm:px-10">
      <div className="mx-auto px-5">
        <div className="flex flex-col items-center">
          <h2 className="mt-5 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Got some questions? Check here.
          </h2>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 md:text-xl">
            Frequently asked questions
          </p>
        </div>
        <div className="mx-auto mt-8 grid w-full divide-y divide-gray-200 dark:divide-gray-700">
          <FAQItem
            question="What is this Kit about?"
            answer="The Next.JS 15 Enterprise starter kit is designed to help solopreneurs, enterprises, or any software organization quickly launch their product. By providing essential features out of the box, it significantly reduces development time and cost, enabling a product launch within just a few hours."
          />

          <FAQItem
            question="Is there a demo link to check?"
            answer="Yes, please click on the View Demo button located on top-right to check the entire demo."
          />
          <FAQItem
            question="What it includes?"
            answer="This kit includes all the important and necessary features like Login, Register, User management and many more along with the main website sameple page."
          />
          <FAQItem
            question="Can I customize it?"
            answer="Yes, once you have purchased this, the entire code is yours. Use it the way you you like and make the change you want."
          />
          <FAQItem
            question="How do I contact support?"
            answer="If you need help with our platform or have any other questions, you can contact the company's support team by submitting a support request through the website or by emailing support@ourwebsite.com."
          />
          <FAQItem
            question="Can I get a refund for my subscription?"
            answer="Once you have access to the repo, this kit is yours to keep permanently, and refunds aren't available.However, you can feel confident knowing that the users typically launch startups within 7 days and generate their first online revenue in no time."
          />
          <FAQItem
            question="Do you offer any discounts or promotions?"
            answer="We may offer discounts or promotions from time to time. To stay up-to-date on the latest deals and special offers, you can sign up for the company's newsletter or follow it on social media."
          />
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
