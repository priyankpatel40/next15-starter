'use server';
import { db } from '@/lib/db';
import { EditUserSchema } from '@/schemas';
import { z } from 'zod';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    console.log('🚀 ~ getUserByEmail ~ user:', user);

    return user;
  } catch (error) {
    console.log('🚀 ~ getUserByEmail ~ error:', error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    let user = await db.user.findUnique({ where: { id } });
    if (user?.cid) {
      user.company = await db.company.findUnique({
        where: { id: user.cid },
        select: {
          id: true,
          company_name: true,
          logo: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          expire_date: true,
          is_trial: true,
        },
      });
    }
    return user;
  } catch (error) {
    console.log('🚀 ~ getUserById ~ error:', error);
    return null;
  }
};

export const getCompanyUsers = async ({
  page,
  itemsPerPage,
  orderBy,
  filter,
  search,
  cid,
}: {
  page: number;
  itemsPerPage: number;
  orderBy: 'asc' | 'desc';
  filter: 'all' | 'active' | 'inactive';
  search?: string;
  cid: string;
}) => {
  const whereClause: any = { cid: cid };

  if (filter !== 'all') {
    whereClause.is_active = filter === 'active';
  }
  if (search) {
    whereClause.name = {
      contains: search,
      mode: 'insensitive',
    };
  }
  try {
    const users = await db.user.findMany({
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      where: whereClause,
      orderBy: {
        name: orderBy,
      },
      select: {
        id: true,
        name: true,
        email: true,
        created_by: true,
        created_at: true,
        image: true,
        role: true,
        is_active: true,
        isTwoFactorEnabled: true,
        emailVerified: true,
      },
    });

    // Fetch creator names
    const creatorIds = users
      .map((user) => user.created_by)
      .filter((id): id is string => id !== null);
    const creators = await db.user.findMany({
      where: { id: { in: creatorIds } },
      select: { id: true, name: true },
    });

    const creatorMap = new Map(creators.map((creator) => [creator.id, creator.name]));

    const usersWithCreatorName = users.map((user) => ({
      ...user,
      creatorName: user.created_by ? creatorMap.get(user.created_by) || null : null,
    }));

    return {
      users: usersWithCreatorName,
    };
  } catch (error) {
    console.log('🚀 ~ getCompanyUsers ~ error:', error);
    return null;
  }
};

export const getCompanyUsersForReports = async ({
  orderBy,
  id,
  filter,
}: {
  orderBy: 'asc' | 'desc';
  id: string;
  filter: 'all' | 'active' | 'inactive';
}) => {
  const whereClause: any = { cid: id };

  if (filter !== 'all') {
    whereClause.is_active = filter === 'active';
  }
  try {
    const [users, totalCount, roleCounts, statusCounts, dailyActiveUsers] =
      await Promise.all([
        db.user.findMany({
          where: whereClause,
          orderBy: {
            name: orderBy,
          },
          select: {
            id: true,
            name: true,
            email: true,
            created_by: true,
            created_at: true,
            image: true,
            role: true,
            is_active: true,
            isTwoFactorEnabled: true,
          },
        }),
        db.user.count({ where: whereClause }),
        db.user.groupBy({
          by: ['role'],
          where: whereClause,
          _count: true,
        }),
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
        WHERE cid = ${id}::uuid
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
      ` as Promise<Array<{ date: string; users: number }>>,
      ]);

    console.log('🚀 ~ getCompanyUsersForReports ~ dailyActiveUsers:', dailyActiveUsers);
    // Fetch creator names
    const creatorIds = users
      .map((user) => user.created_by)
      .filter((id): id is string => id !== null);
    const creators = await db.user.findMany({
      where: { id: { in: creatorIds } },
      select: { id: true, name: true },
    });

    const creatorMap = new Map(creators.map((creator) => [creator.id, creator.name]));

    const usersWithCreatorName = users.map((user) => ({
      ...user,
      creatorName: user.created_by ? creatorMap.get(user.created_by) || null : null,
    }));

    const adminCount = roleCounts.find((r) => r.role === 'ADMIN')?._count ?? 0;
    const userCount = roleCounts.find((r) => r.role === 'USER')?._count ?? 0;
    const activeCount = statusCounts.find((r) => r.is_active)?._count ?? 0;
    const inactiveCount = statusCounts.find((r) => !r.is_active)?._count ?? 0;

    return {
      users: usersWithCreatorName,
      totalCount,
      adminCount,
      userCount,
      activeCount,
      inactiveCount,
      dailyActiveUsers,
    };
  } catch (error) {
    console.log('🚀 ~ getCompanyUsersForReports ~ error:', error);
    return null;
  }
};

export const updateUser = async (values: z.infer<typeof EditUserSchema>, id: string) => {
  console.log('🚀 ~ file: user.ts:225 ~ values:', values);
  try {
    const user = await db.user.update({
      where: { id },
      data: values,
    });

    return { success: true, user };
  } catch (error) {
    console.log('🚀 ~ updateUser ~ error:', error);
    return { error: true, message: 'Error updating user' };
  }
};

export const toggleUserStatusById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = await db.user.update({
      where: { id },
      data: { is_active: !user.is_active },
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
  return { success: true };
};
