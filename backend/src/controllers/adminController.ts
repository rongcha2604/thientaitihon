import { Request, Response } from 'express';
import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import type { JWTPayload } from '../types/index.js';
import { z } from 'zod';

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function adminLogin(req: Request, res: Response) {
  try {
    const data = adminLoginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { email: data.email },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await comparePassword(data.password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload: JWTPayload = {
      userId: admin.id,
      email: admin.email,
      role: 'admin',
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    throw error;
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const { page = '1', limit = '50', search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { fullName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        select: {
          id: true,
          email: true,
          fullName: true,
          grade: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function getUserDetails(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        grade: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get progress summary
    const progressSummary = await prisma.userProgress.groupBy({
      by: ['subject', 'status'],
      where: { userId },
      _count: true,
    });

    // Get analytics summary
    const analyticsSummary = await prisma.userAnalytics.groupBy({
      by: ['eventType'],
      where: { userId },
      _count: true,
      orderBy: { _count: { eventType: 'desc' } },
      take: 10,
    });

    res.json({
      user,
      progressSummary,
      analyticsSummary,
    });
  } catch (error) {
    throw error;
  }
}

export async function getAnalyticsDashboard(req: Request, res: Response) {
  try {
    const { days = '7' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

    // Total users
    const totalUsers = await prisma.user.count();

    // Active users (last 7 days)
    const activeUsers = await prisma.userAnalytics.findMany({
      where: {
        createdAt: { gte: daysAgo },
        eventType: 'login',
      },
      distinct: ['userId'],
    });

    // Total exercises completed
    const totalExercises = await prisma.userProgress.count({
      where: { status: 'completed' },
    });

    // Top subjects
    const topSubjects = await prisma.userProgress.groupBy({
      by: ['subject'],
      where: { status: 'completed' },
      _count: true,
      orderBy: { _count: { subject: 'desc' } },
    });

    // Events by type
    const eventsByType = await prisma.userAnalytics.groupBy({
      by: ['eventType'],
      where: { createdAt: { gte: daysAgo } },
      _count: true,
      orderBy: { _count: { eventType: 'desc' } },
      take: 10,
    });

    res.json({
      totalUsers,
      activeUsers: activeUsers.length,
      totalExercises,
      topSubjects,
      eventsByType,
      period: `${days} days`,
    });
  } catch (error) {
    throw error;
  }
}

export async function getProgressSummary(req: Request, res: Response) {
  try {
    const { bookSeries, grade, subject } = req.query;

    const where: any = { status: 'completed' };
    if (bookSeries) where.bookSeries = bookSeries;
    if (grade) where.grade = parseInt(grade as string);
    if (subject) where.subject = subject;

    const summary = await prisma.userProgress.groupBy({
      by: ['bookSeries', 'grade', 'subject', 'week'],
      where,
      _count: true,
      _avg: { score: true },
      orderBy: [
        { bookSeries: 'asc' },
        { grade: 'asc' },
        { subject: 'asc' },
        { week: 'asc' },
      ],
    });

    res.json({ summary });
  } catch (error) {
    throw error;
  }
}

export async function getAuditLogs(req: Request, res: Response) {
  try {
    const { page = '1', limit = '50' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: parseInt(limit as string),
        include: {
          admin: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count(),
    ]);

    res.json({
      logs,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    throw error;
  }
}

// Update user
const updateUserSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  grade: z.number().int().min(1).max(5).optional(),
  role: z.enum(['student', 'parent', 'admin']).optional(),
  parentPin: z.string().length(4).optional(),
  password: z.string().min(6).optional(),
});

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const data = updateUserSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prepare update data
    const updateData: any = {};
    if (data.email) updateData.email = data.email;
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.grade !== undefined) updateData.grade = data.grade;
    if (data.role) updateData.role = data.role;
    if (data.parentPin) updateData.parentPin = data.parentPin;

    // Hash password if provided
    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        grade: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    throw error;
  }
}

// Update admin user
const updateAdminUserSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  role: z.enum(['admin', 'super_admin']).optional(),
  password: z.string().min(6).optional(),
});

export async function updateAdminUser(req: Request, res: Response) {
  try {
    const adminId = req.params.id;
    const data = updateAdminUserSchema.parse(req.body);

    // Check if admin exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    // Prepare update data
    const updateData: any = {};
    if (data.email) updateData.email = data.email;
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.role) updateData.role = data.role;

    // Hash password if provided
    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    // Update admin
    const updatedAdmin = await prisma.adminUser.update({
      where: { id: adminId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      message: 'Admin user updated successfully',
      admin: updatedAdmin,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    throw error;
  }
}

// Helper to create audit log
export async function createAuditLog(
  adminId: string,
  action: string,
  resourceType?: string,
  resourceId?: string,
  ipAddress?: string
) {
  return prisma.auditLog.create({
    data: {
      adminId,
      action,
      resourceType,
      resourceId,
      ipAddress,
    },
  });
}

