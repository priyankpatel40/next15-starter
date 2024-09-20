/* eslint-disable no-underscore-dangle */

'use server';

import { db } from '@/lib/db';
import logger from '@/lib/logger';

export const getCompanyByName = async (companyName: string) => {
  try {
    const company = await db.company.findFirst({
      where: { companyName: { equals: companyName, mode: 'insensitive' } },
      select: { id: true, companyName: true },
    });
    return company;
  } catch {
    return null;
  }
};
export const getCompanyById = async (id: string) => {
  try {
    const company = await db.company.findFirst({
      where: { id },
    });
    return company;
  } catch {
    return null;
  }
};

export const getAllCompanies = async ({
  page,
  itemsPerPage,
  orderBy,
  filter,
  search,
}: {
  page: number;
  itemsPerPage: number;
  orderBy: 'asc' | 'desc';
  filter: 'all' | 'active' | 'inactive';
  search?: string;
}) => {
  const whereClause: any = {};

  if (filter !== 'all') {
    whereClause.isActive = filter === 'active';
  }
  if (search) {
    whereClause.companyName = {
      contains: search,
      mode: 'insensitive',
    };
  }
  const [companies] = await Promise.all([
    db.company.findMany({
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      where: whereClause,
      orderBy: {
        companyName: orderBy,
      },
    }),
  ]);

  // Fetch creator names
  const creatorIds = companies
    .map((company) => company.createdBy)
    .filter((id): id is string => id !== null);
  const creators = await db.user.findMany({
    where: { id: { in: creatorIds } },
    select: { id: true, name: true, email: true },
  });

  const creatorMap = new Map(
    creators.map((creator) => [creator.id, { name: creator.name, email: creator.email }]),
  );

  // Fetch subscriptions
  const cIds = companies.map((company) => company.id);
  const subscription = await db.subscription.findMany({
    where: { cid: { in: cIds } },
  });
  const subscriptionMap = new Map(subscription.map((sub) => [sub.cid, { sub }]));

  const companiesWithInfo = companies.map((company) => ({
    ...company,
    creatorName: company.createdBy
      ? creatorMap.get(company.createdBy)?.name || null
      : null,
    creatorEmail: company.createdBy
      ? creatorMap.get(company.createdBy)?.email || null
      : null,
    subscription: company.createdBy
      ? subscriptionMap.get(company.id)?.sub || null // Fixed to access the correct property
      : null,
  }));

  return {
    companies: companiesWithInfo,
  };
};
export const getAllCompanyUsersForReports = async ({
  filter,
}: {
  filter: 'all' | 'active' | 'inactive';
}) => {
  const whereClause: any = {};

  if (filter !== 'all') {
    whereClause.isActive = filter === 'active';
  }

  const [totalCount, statusCounts, dailyActiveUsers, dailyLoginActivity] =
    await Promise.all([
      db.user.count({ where: whereClause }),
      db.user.groupBy({
        by: ['isActive'],
        where: whereClause,
        _count: true,
      }),
      db.$queryRaw`
        SELECT 
          TO_CHAR(DATE("createdAt"), 'YYYY-MM-DD') as date, 
          CAST(COUNT(*) AS INTEGER) as users
        FROM "User"
        GROUP BY DATE("createdAt")
        ORDER BY DATE("createdAt")
      ` as Promise<Array<{ date: string; users: number }>>,
      db.$queryRaw`
        SELECT 
          TO_CHAR(DATE("loggedIn"), 'YYYY-MM-DD') as date, 
          CAST(COUNT(*) AS INTEGER) as users
        FROM "User" 
         JOIN "LoginActivity" ON "User".id = "LoginActivity"."userId"
        GROUP BY DATE("loggedIn")
        ORDER BY DATE("loggedIn")
      ` as Promise<Array<{ date: string; users: number }>>,
    ]);

  const activeCount = statusCounts.find((r) => r.isActive)?._count ?? 0;
  const inactiveCount = statusCounts.find((r) => !r.isActive)?._count ?? 0;

  return {
    totalCount,
    activeCount,
    inactiveCount,
    dailyActiveUsers,
    dailyLoginActivity,
  };
};
export const getAllCompaniesforDashboard = async ({
  orderBy,
  filter,
}: {
  orderBy: 'asc' | 'desc';
  filter: 'all' | 'active' | 'inactive';
}) => {
  const whereClause: any = {};

  if (filter !== 'all') {
    whereClause.isActive = filter === 'active';
  }

  const [companies, totalCount, statusCounts, trialCount, dailyActiveCompanies] =
    await Promise.all([
      db.company.findMany({
        where: whereClause,
        orderBy: {
          companyName: orderBy,
        },
      }),
      db.company.count({ where: whereClause }),
      db.company.groupBy({
        by: ['isActive'],
        where: whereClause,
        _count: true,
      }),
      db.company.groupBy({
        by: ['isTrial'],
        where: whereClause,
        _count: true,
      }),
      db.$queryRaw`
        SELECT 
          TO_CHAR(DATE("createdAt"), 'YYYY-MM-DD') as date, 
          CAST(COUNT(*) AS INTEGER) as companies
        FROM "Company"
        GROUP BY DATE("createdAt")
        ORDER BY DATE("createdAt")
      ` as Promise<Array<{ date: string; companies: number }>>,
    ]);

  const activeCount = statusCounts.find((r) => r.isActive)?._count ?? 0;
  const inactiveCount = statusCounts.find((r) => !r.isActive)?._count ?? 0;
  const activeSubscriptions = trialCount.find((r) => r.isTrial)?._count ?? 0;
  const inactiveSubscriptions = trialCount.find((r) => r.isTrial)?._count ?? 0;

  // Fetch creator names
  const creatorIds = companies
    .map((company) => company.createdBy)
    .filter((id): id is string => id !== null);
  const creators = await db.user.findMany({
    where: { id: { in: creatorIds } },
    select: { id: true, name: true, email: true },
  });

  const creatorMap = new Map(
    creators.map((creator) => [creator.id, { name: creator.name, email: creator.email }]),
  );

  const companiesWithCreatorInfo = companies.map((company) => ({
    ...company,
    creatorName: company.createdBy
      ? creatorMap.get(company.createdBy)?.name || null
      : null,
    creatorEmail: company.createdBy
      ? creatorMap.get(company.createdBy)?.email || null
      : null,
  }));

  return {
    companies: companiesWithCreatorInfo,
    totalCount,
    activeCount,
    inactiveCount,
    dailyActiveCompanies,
    activeSubscriptions,
    inactiveSubscriptions,
  };
};

export const deleteCompanyById = async (id: string) => {
  try {
    await db.company.update({
      where: { id },
      data: { isActive: false, isDeleted: true },
    });
  } catch (error) {
    logger.error('Error deleting company:', error);
    throw error;
  }
  return { success: true };
};

export const toggleCompanyStatusById = async (id: string) => {
  try {
    const company = await db.company.findUnique({ where: { id } });
    if (!company) {
      throw new Error('Company not found');
    }
    await db.company.update({
      where: { id },
      data: { isActive: !company.isActive },
    });
  } catch (error) {
    logger.error('Error updating company status:', error);
    throw error;
  }
  return { success: true };
};
