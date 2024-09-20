'use server';

import { type Company, Prisma, UserRole } from '@prisma/client';
import { randomBytes } from 'crypto';
import type * as z from 'zod';

import { auth, unstable_update } from '@/auth';
import { getCompanyByName } from '@/data/company';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import logger from '@/lib/logger';
import { CompanySchema, EditCompanySchema } from '@/schemas';

export const createCompany = async (values: z.infer<typeof CompanySchema>) => {
  logger.info('🚀 ~ createCompany ~ values:', values);
  const validatedFields = CompanySchema.safeParse(values);
  const currentSession = await auth();
  logger.info('🚀 ~ createCompany ~ session:', currentSession);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  const { companyName } = validatedFields.data;
  const existingUser = await getUserByEmail(currentSession?.user.email);
  let company: Company | null = null; // Explicit type definition

  if (existingUser && existingUser.cid === null) {
    try {
      const apiKey = await randomBytes(16).toString('base64');
      logger.error('apikey', apiKey);
      // Use Prisma transaction to ensure both operations succeed or fail together
      await db.$transaction(async (transaction) => {
        // Create the organization
        const createdCompany = (await transaction.company.create({
          data: {
            companyName,
            apiKey,
            isTrial: true,
            expireDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          },
        })) as Company;
        company = createdCompany; // Ensure company is not null
        logger.info('company', company);
        // Associate user with organization
        if (company) {
          await transaction.company.update({
            where: { id: company.id },
            data: { ownerId: existingUser.id, createdBy: existingUser.id },
          });
          await transaction.user.update({
            where: { id: existingUser.id },
            data: { cid: company.id, role: UserRole.ADMIN },
          });

          await unstable_update({
            user: {
              cid: company.id,
              company,
            },
          });
        }
      });
    } catch (e) {
      // Error handling
      let errorMessage: string = 'Something went wrong, unable to create your account.';
      logger.error('Error during user and organization registration:', e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          errorMessage = 'You already have an account.';
        }
      } else {
        errorMessage = 'Something went wrong, unable to create your account.';
      }
      return { error: errorMessage };
    }
  }

  return { success: 'Your account is now ready to use!', company };
};

export const updateCompany = async (
  values: z.infer<typeof EditCompanySchema>,
  id: string,
) => {
  logger.info('🚀 ~ updateCompany ~ values:', values);
  const validatedFields = EditCompanySchema.safeParse(values);
  const currentSession = await auth();
  logger.info('🚀 ~ updateCompany ~ session:', currentSession);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  const { companyName, isTrial, expireDate } = validatedFields.data;
  const existingCompany = await getCompanyByName(companyName);
  if (existingCompany) {
    if (existingCompany?.id !== id) {
      return { error: 'Company name already exists.' };
    }
  }
  try {
    await db.company.update({
      where: { id },
      data: {
        companyName,
        updatedAt: new Date(),
        isTrial,
        expireDate,
      },
    });
  } catch (e) {
    // Error handling
    let errorMessage: string = 'Something went wrong, unable to create your account.';
    logger.error('Error during user and organization registration:', e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        errorMessage = 'You already have an account.';
      }
    } else {
      errorMessage = 'Something went wrong, unable to create your account.';
    }
    return { error: errorMessage };
  }

  return { success: true };
};
