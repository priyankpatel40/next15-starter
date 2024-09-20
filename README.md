# Next Auth v5 and Next.js 15 - Comprehensive Enterprise ready Starter Kit with Typescript and Tailwind CSS

This repository serves as a robust starter kit for implementing advanced authentication features using Next Auth v5 within a Next.js 15 application. It is meticulously designed to enable developers to swiftly establish a secure and feature-rich authentication system for any enterprise software.

## Table of Contents

- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)
- [Troubleshooting](#troubleshooting)
- [Email Configuration](#email-configuration)
- [Code Style](#code-style)

## Technologies Used

<p align="center">
  <a href="https://nextjs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" width="160" height="40"/>
  </a>
  <a href="https://authjs.dev/" target="_blank">
    <img src="https://camo.githubusercontent.com/02d9778d04c0ec14c520fd512e0033ab2413cbd17eee64bdff91da51b832628d/68747470733a2f2f617574686a732e6465762f696d672f6c6f676f2d736d2e706e67" alt="Auth.js" width="40" height="40"/>
  </a>
  <a href="https://www.prisma.io/" target="_blank">
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" width="160" height="40"/>
  </a>
  <a href="https://tailwindcss.com/" target="_blank">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" width="160" height="40"/>
  </a>
  <a href="https://stripe.com/" target="_blank">
    <img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" width="160" height="40"/>
  </a>
  <a href="https://next-intl-docs.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Next%20Intl-FF3D00?style=for-the-badge&logo=next.js&logoColor=white" alt="Next Intl" width="160" height="40"/>
  </a>
</p>

## Key Features

- 🔒 Advanced authentication with NextAuth v5 (Auth.js)
- 🔥 Type checking TypeScript
- ⚡ Seamless integration with Next.js 15 App Router and server actions
- 📦 Type-safe ORM with Prisma and PostgreSQL
- 🔴 Validation library with Zod
- 🔑 Support for Credentials Provider and OAuth integration (Google & GitHub)
- 📨 Email verification and change functionality
- 🛡️ Two-factor authentication support with configurable settings
- 👤 Role-based access control (Admin & User) with Admin-only content rendering
- 🚪 Versatile login component (modal or redirect) and user registration component
- 🤔 Forgot password and verification components
- ✅ Comprehensive error handling and login/logout functionality
- 🚫 Role Gate for content access and protected API routes
- 🔍 Middleware exploration in Next.js
- 🔗 Extended session management with customizable NextAuth callbacks
- 💻 Examples for server & client components
- 📊 Basic reporting features for SuperAdmins
- 🎭 Comprehensive end-to-end testing with Playwright
- 🎨 Tailwind CSS for responsive styling with support for dark and light themes
- 💳 Stripe integration for payment processing, including subscription management
- 🌐 Internationalization support via Next-Intl

## Styling and Theming

This project utilizes Tailwind CSS, a utility-first CSS framework, to facilitate the creation of responsive and customizable user interfaces. The application supports both dark and light themes, allowing users to select their preferred visual style. Theme-specific styles can be implemented using Tailwind's dark mode classes.

### Translation (i18n) Setup

This project utilizes next-intl in conjunction with Crowdin for translation management. As a developer, you primarily need to manage the English (or default language) version. Other languages are automatically generated and handled by Crowdin. You can collaborate with your translation team on Crowdin or use machine translation for assistance.

To set up translation (i18n):

1. Create an account at Crowdin.com and initiate a new project. You will find the project ID in the project settings.
2. Generate Personal Access Tokens by navigating to Account Settings > API.
3. In your GitHub Actions, define the following environment variables:
   - `CROWDIN_PROJECT_ID`
   - `CROWDIN_PERSONAL_TOKEN`

Once these environment variables are set, your localization files will sync with Crowdin automatically whenever you push a new commit to the main branch.

## Getting Started

### Prerequisites

- Node.js version 18.7.x or later
- pnpm package manager

### Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/priyankpatel40/next15-starter.git
   cd next15-starter
   ```

2. Install dependencies:

   ```shell
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   DATABASE_URL=
   DIRECT_URL=
   NEXTAUTH_SECRET=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   RESEND_API_KEY=
   NEXT_PUBLIC_APP_URL=
   STRIPE_SECRET_KEY=
   ```

4. Set up Prisma:

   ```shell
   pnpm dlx prisma generate
   pnpm dlx prisma db push
   ```

5. Start the development server:

   ```shell
   pnpm dev
   ```

6. Configure Tailwind CSS:
   The project includes a pre-configured `tailwind.config.js` file, which can be customized to adjust themes, extend configurations, or add plugins.

## Available Scripts

| Command      | Description                       |
| ------------ | --------------------------------- |
| `pnpm dev`   | Starts the development server     |
| `pnpm build` | Builds the production application |
| `pnpm start` | Starts the production server      |
| `pnpm lint`  | Runs the linter                   |

## Demo

🚀 [View Live Demo](https://nexttest-nine-lake.vercel.app/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

If you encounter any issues during setup or usage, please check the following:

1. Ensure all environment variables are correctly set in your `.env` file.
2. Make sure your database is running and accessible.
3. Verify that you have the correct Node.js version installed.

For more detailed troubleshooting, please refer to the [Next.js documentation](https://nextjs.org/docs) and [NextAuth.js documentation](https://next-auth.js.org/getting-started/introduction).

If you're still experiencing problems, please open an issue in this repository.

## Email Configuration

This project employs Google SMTP for sending emails and utilizes react-email for creating email templates. To set up email functionality:

1. Ensure you have a Google account.
2. Enable "Less secure app access" or use App Passwords if you have 2-factor authentication enabled.
3. Add the following to your `.env` file:
   ```
   SMTP_SERVER_HOST='smtp.gmail.com'
   SMTP_SERVER_USERNAME="your-email@gmail.com"
   SMTP_SERVER_PASSWORD="xxxx xxxx xxxx xxxx"
   SMTP_SERVER_PORT=587
   ```

Replace the values with your actual Google account details.

### Email Templates

We utilize react-email to create and manage email templates, allowing for responsive and customizable designs using React components. You can find the email templates in the `emails` directory.

To preview and test email templates:

1. Run the react-email development server:
   ```
   pnpm email dev
   ```
2. Open your browser and navigate to `http://localhost:3000` to view and interact with your email templates.

For more information on creating and customizing email templates, refer to the [react-email documentation](https://react.email/docs/introduction).

## Code Style

This project employs ESLint and Prettier for consistent code formatting.

Made with ♥ 

[![Sponsor Next-15 starter](https://cdn.buymeacoffee.com/buttons/default-red.png)](https://github.com/sponsors/ppriyank40)
