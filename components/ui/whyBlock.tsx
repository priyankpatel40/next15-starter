import React from 'react';

// Task and Feature types
interface Task {
  hours: string;
  description: string;
  color: string;
  icon: string;
}

const tasks: Task[] = [
  {
    hours: '40 hours',
    description: 'Setting up authentication',
    color: 'text-pink-400',
    icon: '🔑', // Key icon for authentication
  },
  {
    hours: '30 hours',
    description: 'User management',
    color: 'text-pink-400',
    icon: '👥', // Two people icon for user management
  },
  {
    hours: '30 hours',
    description: 'Company management',
    color: 'text-pink-400',
    icon: '🏢', // Building icon for company management
  },
  {
    hours: '4 hours',
    description: 'Setting up emails',
    color: 'text-pink-400',
    icon: '📧', // Email icon for setting up emails
  },
  {
    hours: '8 hours',
    description: 'Designing a landing page',
    color: 'text-green-400',
    icon: '🎨', // Palette icon for designing
  },
  {
    hours: '70 hours',
    description: 'Adding payment and subscription system',
    color: 'text-blue-400',
    icon: '💳', // Credit card icon for payments
  },
  {
    hours: '1 hour',
    description: 'Adding SEO tags',
    color: 'text-purple-400',
    icon: '🔍', // Magnifying glass icon for SEO
  },
  {
    hours: '5 hours',
    description: 'Setting up Google and GitHub OAuth',
    color: 'text-yellow-400',
    icon: '🔑', // Key icon for OAuth
  },
  {
    hours: '10 hours',
    description: 'Creating normal main website page',
    color: 'text-teal-400',
    icon: '🌐', // Globe icon for website
  },
  {
    hours: '∞ hours',
    description: 'Overthinking...',
    color: 'text-indigo-400',
    icon: '🤔', // Thinking face icon for overthinking
  },
];

const features = [
  '🔥 Type checking with TypeScript',
  '🎨 Pre-built main website page',
  '⚡ Seamless integration with Next.js 15 App Router and server actions',
  '📦 Type-safe ORM with Prisma and PostgreSQL',
  '🔴 Profile and User Management',
  '🔑 Credential login along with OAuth integration (Google & GitHub) and Link',
  '📨 Domain Management',
  '🛡️ Two-factor authentication support with configurable settings',
  '👤 Role-based access control (Admin & User) with Admin-only content rendering',
  '🤔 Forgot password and verification components',
  '🎨 Responsive Pages',
  '🔍 Middleware exploration in Next.js to add secure access based on role',
  '📊 Basic reporting and analytics features for SuperAdmins',
  '🎭 Comprehensive end-to-end testing with Playwright',
  '🎨 Tailwind CSS for responsive styling with support for dark and light themes',
  '💳 Stripe integration for payment processing, including subscription management',
  '🌐 Internationalization support via Next-Intl',
];

const WhyBlock: React.FC = () => {
  return (
    <div className="mx-auto my-12 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 p-8">
      <h2 className="mb-12 text-center text-4xl font-bold tracking-wide text-gray-800">
        Why Use It?
      </h2>

      <div className="flex flex-col gap-10 md:flex-row">
        {/* Left Side: Tasks */}
        <div className="rounded-xl bg-white p-8 shadow-lg md:w-1/2">
          <h3 className="mb-6 text-2xl font-bold text-gray-900">Time Saving</h3>
          <ul className="space-y-6">
            {tasks.map((task) => (
              <li key={task.description} className="flex items-center space-x-6">
                <span className={`text-4xl ${task.color}`}>{task.icon}</span>
                <div>
                  <p className="text-xl font-semibold text-gray-800">{task.hours}</p>
                  <p className="text-gray-600">{task.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
            <span className="text-2xl font-semibold text-white ">
              Saves ~ 200 hours of work
            </span>
          </div>
        </div>

        {/* Right Side: Features */}
        <div className="rounded-xl bg-white p-8 shadow-lg md:w-1/2">
          <h3 className="mb-6 text-2xl font-bold text-gray-900">Prebuilt Features</h3>
          <ul className="list-inside list-disc space-y-4 text-gray-700">
            {features.map((feature) => (
              <li key={feature} className="text-lg font-medium">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WhyBlock;
