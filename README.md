# Next Auth v5 and Next.js 15 - Starter Kit

This repository provides a robust starter kit for implementing advanced authentication features using Next Auth v5 in a Next.js 15 application. It's designed to help developers quickly set up a secure, feature-rich authentication system.
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Next Auth](https://img.shields.io/badge/NextAuth-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)


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


> **Note:** To use SuperAdmin role and features, you need to manually change the user role to "SUPERADMIN" in the database. This is for security reasons and is not available through the user interface.

## Getting Started

### Prerequisites

- Node.js version 18.7.x or later
- npm or yarn package manager
- A database supported by Prisma (e.g., PostgreSQL, MySQL)
- OAuth credentials (for Google and GitHub providers)
- Resend API key for email functionality

### Installation

1. Clone the repository:
   ```shell
   git clone https://github.com/priyankpatel40/next15-starter.git
   cd next-auth-v5-advanced-guide
   ```

2. Install dependencies:
   ```shell
   npm install
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
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server:
   ```shell
   npm run dev
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the production application |
| `npm start` | Starts the production server |
| `npm run lint` | Runs the linter |

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
