# Next Auth v5 and Next.js 15 - Starter Kit

This repository provides a robust starter kit for implementing advanced authentication features using Next Auth v5 in a Next.js 15 application. It's designed to help developers quickly set up a secure, feature-rich authentication system.

## Table of Contents
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Troubleshooting](#troubleshooting)

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
</p>

## Key Features

- 🔒 Next-auth v5 (Auth.js)
- ⚡ Next.js 15 with server actions
- 🔑 Credentials Provider
- 🌍 OAuth Provider (Google & GitHub)
- 🔐 Forgot password functionality
- 📨 Email verification
- 🛡️ Two-factor authentication
- 👤 User roles (Admin & User)
- 🚪 Login component (modal or redirect)
- 📝 Register component
- 🤔 Forgot password component
- ✅ Verification component
- ❗ Error component
- 🔘 Login/Logout buttons
- 🚫 Role Gate
- 🔍 Next.js middleware exploration
- 🔗 Extended next-auth session
- 🔄 Next-auth callbacks
- 🎣 Custom hooks: useCurrentUser, useRole
- 🛠️ Utilities: currentUser, currentRole
- 💻 Server & client component examples
- 👑 Admin-only content rendering
- 🔒 Protected API routes and server actions
- 📧 Email change with verification
- 🔏 Password change with confirmation
- ⚙️ Two-factor auth settings
- 🏢 SuperAdmin dashboard for Company management
- 📊 Basic reports for SuperAdmins
- 📨 Email sending with Google SMTP
- 🎭 End-to-end testing with Playwright
- 🎨 Tailwind CSS for styling
- 🌓 Dark and light theme support

## Styling and Theming

This project uses Tailwind CSS for styling, providing a utility-first CSS framework that makes it easy to create responsive and customizable user interfaces.

### Dark and Light Themes

The application supports both dark and light themes, allowing users to choose their preferred visual style. The theme can be toggled using the theme switcher component provided in the UI.

To implement theme-specific styles, use Tailwind's dark mode classes:

```jsx
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  {/* Your content here */}
</div>
```

The theme preference is stored in local storage, ensuring that the user's choice persists across sessions.

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
   The project comes with a pre-configured `tailwind.config.js` file. You can customize this file to adjust the theme, extend the default configuration, or add plugin

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Starts the development server |
| `pnpm build` | Builds the production application |
| `pnpm start` | Starts the production server |
| `pnpm lint` | Runs the linter |

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

This project uses Google SMTP for sending emails and react-email for creating email templates. To set up email functionality:

1. Ensure you have a Google account
2. Enable "Less secure app access" or use App Passwords if you have 2-factor authentication enabled
3. Add the following to your `.env` file:
   ```
   SMTP_SERVER_HOST='smtp.gmail.com'
   SMTP_SERVER_USERNAME="your-email@gmail.com"
   SMTP_SERVER_PASSWORD="xxxx xxxx xxxx xxxx"
   SMTP_SERVER_PORT=587
   ```

Replace the values with your actual Google account details.

### Email Templates

We use react-email to create and manage email templates. This allows us to build responsive and customizable email templates using React components. You can find the email templates in the `emails` directory.

To preview and test email templates:

1. Run the react-email development server:
   ```
   pnpm email dev
   ```
2. Open your browser and navigate to `http://localhost:3000` to view and interact with your email templates.

For more information on creating and customizing email templates, refer to the [react-email documentation](https://react.email/docs/introduction).

## Code Style

This project uses ESLint and Prettier for code formatting. 
