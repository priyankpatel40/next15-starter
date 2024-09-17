'use server';
import { db } from '@/lib/db';
export const getCompanyByName = async (company_name: string) => {
  try {
    const company = await db.company.findFirst({
      where: { company_name: { equals: company_name, mode: 'insensitive' } },
      select: { id: true, company_name: true },
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
    whereClause.is_active = filter === 'active';
  }
  if (search) {
    whereClause.company_name = {
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
        company_name: orderBy,
      },
    }),
  ]);

  // Fetch creator names
  const creatorIds = companies
    .map((company) => company.created_by)
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
    creatorName: company.created_by
      ? creatorMap.get(company.created_by)?.name || null
      : null,
    creatorEmail: company.created_by
      ? creatorMap.get(company.created_by)?.email || null
      : null,
    subscription: company.created_by
      ? subscriptionMap.get(company.id)?.sub || null // Fixed to access the correct property
      : null,
  }));

  return {
    companies: companiesWithInfo,
  };
};
export const getAllCompanyUsersForReports = async ({
  orderBy,
  filter,
}: {
  orderBy: 'asc' | 'desc';
  filter: 'all' | 'active' | 'inactive';
}) => {
  const whereClause: any = {};

  if (filter !== 'all') {
    whereClause.is_active = filter === 'active';
  }

  const [totalCount, statusCounts, dailyActiveUsers, dailyLoginActivity] =
    await Promise.all([
      db.user.count({ where: whereClause }),
      db.user.groupBy({
        by: ['is_active'],
        where: whereClause,
        _count: true,
      }),
      db.$queryRaw`
        SELECT 
          TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date, 
          CAST(COUNT(*) AS INTEGER) as users
        FROM "User"
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      ` as Promise<Array<{ date: string; users: number }>>,
      db.$queryRaw`
        SELECT 
          TO_CHAR(DATE(logged_in), 'YYYY-MM-DD') as date, 
          CAST(COUNT(*) AS INTEGER) as users
        FROM "User" 
         JOIN "LoginActivity" ON "User".id = "LoginActivity"."userId"
        GROUP BY DATE(logged_in)
        ORDER BY DATE(logged_in)
      ` as Promise<Array<{ date: string; users: number }>>,
    ]);

  const activeCount = statusCounts.find((r) => r.is_active)?._count ?? 0;
  const inactiveCount = statusCounts.find((r) => !r.is_active)?._count ?? 0;

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
    whereClause.is_active = filter === 'active';
  }

  const [companies, totalCount, statusCounts, dailyActiveCompanies] = await Promise.all([
    db.company.findMany({
      where: whereClause,
      orderBy: {
        company_name: orderBy,
      },
    }),
    db.company.count({ where: whereClause }),
    db.company.groupBy({
      by: ['is_active'],
      where: whereClause,
      _count: true,
    }),
    db.$queryRaw`
        SELECT 
          TO_CHAR(DATE(created_at), 'YYYY-MM-DD') as date, 
          CAST(COUNT(*) AS INTEGER) as companies
        FROM "Company"
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      ` as Promise<Array<{ date: string; companies: number }>>,
  ]);

  const activeCount = statusCounts.find((r) => r.is_active)?._count ?? 0;
  const inactiveCount = statusCounts.find((r) => !r.is_active)?._count ?? 0;
  const activeSubscriptions =
    statusCounts.find((r) => r.is_active && !r.is_trial)?._count ?? 0;
  const inactiveSubscriptions =
    statusCounts.find((r) => r.is_active && r.is_trial)?._count ?? 0;

  // Fetch creator names
  const creatorIds = companies
    .map((company) => company.created_by)
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
    creatorName: company.created_by
      ? creatorMap.get(company.created_by)?.name || null
      : null,
    creatorEmail: company.created_by
      ? creatorMap.get(company.created_by)?.email || null
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
      data: { is_active: false, is_deleted: true },
    });
  } catch (error) {
    console.error('Error deleting company:', error);
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
    const updatedCompany = await db.company.update({
      where: { id },
      data: { is_active: !company.is_active },
    });
  } catch (error) {
    console.error('Error updating company status:', error);
    throw error;
  }
  return { success: true };
};
