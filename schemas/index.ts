import * as z from 'zod';
import { UserRole } from '@prisma/client';
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  email: z.optional(z.string().email()),
});

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: 'Minimum 8 characters required',
    })
    .regex(
      passwordRegex,
      'Password should contain at least one uppercase, one lowercase and one special character',
    ),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z
    .string()
    .min(8, {
      message: 'Minimum 8 characters required',
    })
    .regex(
      passwordRegex,
      'Password should contain at least one uppercase, one lowercase and one special character',
    ),
  name: z
    .string()
    .min(3, {
      message: 'Name with minimum 3 characters required',
    })
    .max(40, {
      message: 'Maximum 40 characters allowed',
    }),
});
export const CompanySchema = z.object({
  company_name: z
    .string({
      required_error: 'Company name is required!',
    })
    .trim()
    .min(3, {
      message: 'Minimum 3 characters required',
    }) // Set maximum length
    .max(20, {
      message: 'Maximum 20 characters allowed',
    }), // Set maximum length
});
export const CreateUserSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z
    .string()
    .min(8, {
      message: 'Minimum 8 characters required',
    })
    .regex(
      passwordRegex,
      'Password should contain at least one uppercase, one lowercase and one special character',
    ),
  name: z
    .string()
    .min(3, {
      message: 'Name with minimum 3 characters required',
    })
    .max(40, {
      message: 'Maximum 40 characters allowed',
    }),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
});

export const EditCompanySchema = z.object({
  company_name: z
    .string({
      required_error: 'Company name is required!',
    })
    .trim()
    .min(3, {
      message: 'Minimum 3 characters required',
    })
    .max(20, {
      message: 'Maximum 20 characters allowed',
    }),
  is_trial: z.boolean().optional(),
  expire_date: z.date().nullable(),
});
export const EditUserSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: 'Minimum 8 characters required',
    })
    .regex(
      passwordRegex,
      'Password should contain at least one uppercase, one lowercase and one special character',
    )
    .optional(),
  name: z
    .string()
    .min(3, {
      message: 'Name with minimum 3 characters required',
    })
    .max(40, {
      message: 'Maximum 40 characters allowed',
    }),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  is_active: z.boolean().optional(),
  isTwoFactorEnabled: z.boolean().optional(),
});
export const ChangePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, {
        message: 'Minimum 8 characters required',
      })
      .regex(
        passwordRegex,
        'Password should contain at least one uppercase, one lowercase and one special character',
      ),
    confirmPassword: z
      .string()
      .min(8, {
        message: 'Minimum 8 characters required',
      })
      .regex(
        passwordRegex,
        'Password should contain at least one uppercase, one lowercase and one special character',
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords does not match',
  });

export const SubscriptionSchema = z.object({
  cid: z.string({
    required_error: 'Company id is required!',
  }),
  userId: z.string({
    required_error: 'User id is required!',
  }),
  productId: z.string({
    required_error: 'Product is required!',
  }),
  priceId: z.string({
    required_error: 'Pricing id is required!',
  }),
  email: z.string({
    required_error: 'Email id is required!',
  }),
  quantity: z
    .number()
    .int() // Ensures it's an integer
    .min(1) // Optional: Ensures it is at least 1 (or any other minimum constraint you want)
    .default(1),
});
