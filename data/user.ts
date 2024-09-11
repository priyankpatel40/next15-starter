'use server';
import { db } from '@/lib/db';
import { EditUserSchema } from '@/schemas';
import { z } from 'zod';
import { cookies } from 'next/headers';

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
          TO_CHAR(DATE(logged_in), 'YYYY-MM-DD') as date, 
          CAST(COUNT(*) AS INTEGER) as users
        FROM "User" 
         JOIN "LoginActivity" ON "User".id = "LoginActivity"."userId"
        WHERE cid = ${id}::uuid
        GROUP BY DATE(logged_in)
        ORDER BY DATE(logged_in)
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

export const saveLoginActivity = async (userId: string) => {
  try {
    const cookieStore = cookies();
    const userAgent = JSON.parse(cookieStore.get('userAgent')?.value || '{}');
    console.log('🚀 ~ file: user.ts:247 ~ saveLoginActivity ~ userAgent:', userAgent);
    const loginActivity = await db.loginActivity.create({
      data: {
        userId,
        logged_in: new Date(),
        device: userAgent.device.model,
        browser: userAgent.browser.name,
        os: userAgent.os.name,
        cpu: userAgent.cpu.architecture,
        isMobile: userAgent.device.type === 'mobile',
        device_vendor: userAgent.device.vendor,
        browser_version: userAgent.browser.version,
        os_version: userAgent.os.version,
      },
    });
    cookieStore.delete('userAgent');
    return loginActivity.id;
  } catch (error) {
    console.error('Error saving login activity:', error);
    return false;
  }
};

export const getBrowserData = async () => {
  try {
    const browserData = (
      await db.loginActivity.groupBy({
        by: ['browser'],
        _count: true,
      })
    ).map((item) => ({
      name: item.browser, // Rename the device column to name
      value: item._count, // Rename the count column to value
    }));
    return browserData;
  } catch (error) {
    console.error('Error getting browser data:', error);
    return null;
  }
};
export const getOsData = async () => {
  try {
    const osData = (
      await db.loginActivity.groupBy({
        by: ['os'],
        _count: true,
      })
    ).map((item) => ({
      name: item.os, // Rename the device column to name
      value: item._count, // Rename the count column to value
    }));
    return osData;
  } catch (error) {
    console.error('Error getting OS data:', error);
    return null;
  }
};
export const getDeviceData = async () => {
  try {
    const deviceData = (
      await db.loginActivity.groupBy({
        by: ['device'],
        _count: true,
      })
    ).map((item) => ({
      name: item.device, // Rename the device column to name
      value: item._count, // Rename the count column to value
    }));
    return deviceData;
  } catch (error) {
    console.error('Error getting device data:', error);
    return null;
  }
};
export const getCpuData = async () => {
  try {
    const cpuData = (
      await db.loginActivity.groupBy({
        by: ['cpu'],
        _count: true,
      })
    ).map((item) => ({
      name: item.cpu, // Rename the device column to name
      value: item._count, // Rename the count column to value
    }));
    return cpuData;
  } catch (error) {
    console.error('Error getting CPU data:', error);
    return null;
  }
};
export const updateUserLoginStatus = async (id: string) => {
  try {
    if (id) {
      await db.loginActivity.update({
        where: { id },
        data: { logged_out: new Date() },
      });
    }
  } catch (error) {
    console.error('Error setting logout:', error);
  }
  return true;
};
export const getUserLoginStatus = async (id: string) => {
  try {
    const user = await db.loginActivity.findFirst({
      where: { userId: id },
      orderBy: { logged_in: 'desc' }, // Order by logged_in in descending order
    });
    return user;
  } catch (error) {
    console.error('Error getting user login status:', error);
    return null;
  }
};
