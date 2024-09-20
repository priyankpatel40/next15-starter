/* eslint-disable no-underscore-dangle */

'use server';

import { cookies } from 'next/headers';
import type { z } from 'zod';

import { db } from '@/lib/db';
import logger from '@/lib/logger';
import type { EditUserSchema } from '@/schemas';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    logger.info('🚀 ~ getUserByEmail ~ user:', user);

    return user;
  } catch (error) {
    logger.info('🚀 ~ getUserByEmail ~ error:', error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    logger.info(user);
    if (user?.cid) {
      const usercompany = await db.company.findUnique({
        where: { id: user.cid },
        select: {
          id: true,
          companyName: true,
          logo: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          expireDate: true,
          isTrial: true,
        },
      });
      const userWithCompany = { ...user, company: { usercompany } };
      return userWithCompany;
    }
    return user;
  } catch (error) {
    logger.info('🚀 ~ getUserById ~ error:', error);
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
  filter: string;
  search?: string;
  cid: string;
}) => {
  const whereClause: any = { cid };

  if (filter !== 'all') {
    whereClause.isActive = filter === 'active';
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
        createdBy: true,
        createdAt: true,
        image: true,
        role: true,
        isActive: true,
        isTwoFactorEnabled: true,
        emailVerified: true,
        isDeleted: true,
      },
    });
    if (users.length > 0) {
      // Fetch creator names
      const creatorIds = users
        .map((user) => user.createdBy)
        .filter((id): id is string => id !== null);
      const creators = await db.user.findMany({
        where: { id: { in: creatorIds } },
        select: { id: true, name: true },
      });

      const creatorMap = new Map(creators.map((creator) => [creator.id, creator.name]));

      const usersWithCreatorName = users.map((user) => ({
        ...user,
        creatorName: user.createdBy ? creatorMap.get(user.createdBy) || null : null,
      }));

      return {
        users: usersWithCreatorName,
      };
    }
    return null;
  } catch (error) {
    logger.info('🚀 ~ getCompanyUsers ~ error:', error);
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
    whereClause.isActive = filter === 'active';
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
            createdBy: true,
            createdAt: true,
            image: true,
            role: true,
            isActive: true,
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
          by: ['isActive'],
          where: whereClause,
          _count: true,
        }),
        db.$queryRaw`
        SELECT 
          TO_CHAR(DATE(loggedIn), 'YYYY-MM-DD') as date, 
          CAST(COUNT(*) AS INTEGER) as users
        FROM "User" 
         JOIN "LoginActivity" ON "User".id = "LoginActivity"."userId"
        WHERE cid = ${id}::uuid
        GROUP BY DATE(loggedIn)
        ORDER BY DATE(loggedIn)
      ` as Promise<Array<{ date: string; users: number }>>,
      ]);

    logger.info('🚀 ~ getCompanyUsersForReports ~ dailyActiveUsers:', dailyActiveUsers);
    // Fetch creator names
    const creatorIds = users
      .map((user) => user.createdBy)
      .filter((ids): ids is string => ids !== null);
    const creators = await db.user.findMany({
      where: { id: { in: creatorIds } },
      select: { id: true, name: true },
    });

    const creatorMap = new Map(creators.map((creator) => [creator.id, creator.name]));

    const usersWithCreatorName = users.map((user) => ({
      ...user,
      creatorName: user.createdBy ? creatorMap.get(user.createdBy) || null : null,
    }));

    const adminCount = roleCounts.find((r) => r.role === 'ADMIN')?._count ?? 0;
    const userCount = roleCounts.find((r) => r.role === 'USER')?._count ?? 0;
    const activeCount = statusCounts.find((r) => r.isActive)?._count ?? 0;
    const inactiveCount = statusCounts.find((r) => !r.isActive)?._count ?? 0;

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
    logger.info('🚀 ~ getCompanyUsersForReports ~ error:', error);
    return null;
  }
};

export const updateUser = async (values: z.infer<typeof EditUserSchema>, id: string) => {
  logger.info('🚀 ~ file: user.ts:225 ~ values:', values);
  try {
    const user = await db.user.update({
      where: { id },
      data: values,
    });

    return { success: true, user };
  } catch (error) {
    logger.info('🚀 ~ updateUser ~ error:', error);
    return { error: true, message: 'Error updating user' };
  }
};

export const toggleUserStatusById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    await db.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });
  } catch (error) {
    logger.error('Error updating user status:', error);
    throw error;
  }
  return { success: true };
};

export const saveLoginActivity = async (userId: string) => {
  try {
    const cookieStore = cookies();
    const userAgent = JSON.parse(cookieStore.get('userAgent')?.value || '{}');
    logger.info('🚀 ~ file: user.ts:247 ~ saveLoginActivity ~ userAgent:', userAgent);
    const loginActivity = await db.loginActivity.create({
      data: {
        userId,
        loggedIn: new Date(),
        device: userAgent.device.model,
        browser: userAgent.browser.name,
        os: userAgent.os.name,
        cpu: userAgent.cpu.architecture,
        isMobile: userAgent.device.type === 'mobile',
        deviceVendor: userAgent.device.vendor,
        browserVersion: userAgent.browser.version,
        osVersion: userAgent.os.version,
      },
    });
    cookieStore.delete('userAgent');
    return loginActivity.id;
  } catch (error) {
    logger.error('Error saving login activity:', error);
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
    logger.error('Error getting browser data:', error);
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
    logger.error('Error getting OS data:', error);
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
    logger.error('Error getting device data:', error);
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
    logger.error('Error getting CPU data:', error);
    return null;
  }
};
export const updateUserLoginStatus = async (id: string) => {
  try {
    if (id) {
      await db.loginActivity.update({
        where: { id },
        data: { loggedOut: new Date() },
      });
    }
  } catch (error) {
    logger.error('Error setting logout:', error);
  }
  return true;
};
export const getUserLoginStatus = async (id: string) => {
  try {
    const user = await db.loginActivity.findFirst({
      where: { userId: id },
      orderBy: { loggedIn: 'desc' }, // Order by loggedIn in descending order
    });
    return user;
  } catch (error) {
    logger.error('Error getting user login status:', error);
    return null;
  }
};
