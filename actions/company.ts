'use server';

import * as z from 'zod';
import { db } from '@/lib/db';
import { CompanySchema, EditCompanySchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { Prisma, UserRole } from '@prisma/client';
import { randomBytes } from 'crypto';
import { auth, unstable_update } from '@/auth';
import { getCompanyByName } from '@/data/company';

export const createCompany = async (values: z.infer<typeof CompanySchema>) => {
  console.log('🚀 ~ createCompany ~ values:', values);
  const validatedFields = CompanySchema.safeParse(values);
  const currentSession = await auth();
  console.log('🚀 ~ createCompany ~ session:', currentSession);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  const { company_name } = validatedFields.data;
  const existingUser = await getUserByEmail(currentSession?.user.email);
  let company = null;
  if (existingUser && existingUser.cid === null) {
    try {
      const apiKey = await randomBytes(16).toString('base64');
      console.error('apikey', apiKey);
      // Use Prisma transaction to ensure both operations succeed or fail together
      const result = await db.$transaction(async (db) => {
        // Create the organization
        company = await db.company.create({
          data: {
            company_name,
            api_key: apiKey,
            is_trial: true,
            expire_date: new Date(),
          },
        });
        console.log('company', company);
        // Associate user with organization
        const updateOrg = await db.company.update({
          where: { id: company.id },
          data: { owner_id: existingUser.id, created_by: existingUser.id },
        });
        const updateUser = await db.user.update({
          where: { id: existingUser.id },
          data: { cid: company.id, role: UserRole.ADMIN },
        });
      });
      const updatedSession = await unstable_update({
        user: {
          cid: company?.id,
          company: company,
        },
      });
      console.log('updatedSession', updatedSession);
    } catch (e) {
      // Error handling
      let errorMessage: string = 'Something went wrong, unable to create your account.';
      console.error('Error during user and organization registration:', e);
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

  return { success: 'Your account is now ready to use!', company: company };
};

export const updateCompany = async (
  values: z.infer<typeof EditCompanySchema>,
  id: string,
) => {
  console.log('🚀 ~ updateCompany ~ values:', values);
  const validatedFields = EditCompanySchema.safeParse(values);
  const currentSession = await auth();
  console.log('🚀 ~ updateCompany ~ session:', currentSession);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  const { company_name, is_trial, expire_date } = validatedFields.data;
  const existingCompany = await getCompanyByName(company_name);
  if (existingCompany) {
    if (existingCompany?.id !== id) {
      return { error: 'Company name already exists.' };
    }
  }
  try {
    const result = await db.company.update({
      where: { id: id },
      data: {
        company_name: company_name,
        updated_at: new Date(),
        is_trial: is_trial,
        expire_date: expire_date,
      },
    });
  } catch (e) {
    // Error handling
    let errorMessage: string = 'Something went wrong, unable to create your account.';
    console.error('Error during user and organization registration:', e);
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
