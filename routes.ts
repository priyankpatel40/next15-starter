/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  '/',
  '/new-verification',
  '/verify-request',
  '/home',
  '/pricing',
  '/contact',
  '/terms',
  '/about',
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /profile-settings
 * @type {string[]}
 */
export const authRoutes = ['/login', '/register', '/error', '/reset', '/new-password'];
export const createCompanyRoute = ['/create-company'];
export const superAdminRoute = ['/companies'];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/profile-settings';
export const DEFAULT_SIGNUP_REDIRECT = '/create-company';
