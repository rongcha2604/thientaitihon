import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import type { JWTPayload } from '../types/index.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
  grade: z.number().int().min(1).max(5).optional(),
  parentPin: z.string().length(4).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        grade: data.grade,
        parentPin: data.parentPin,
        role: 'student',
      },
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

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json({
      user,
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

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    // Try to find user in users table first
    let user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        fullName: true,
        grade: true,
        avatarUrl: true,
        role: true,
        passwordHash: true,
        createdAt: true,
      },
    });

    // If not found in users table, check admin_users table
    if (!user) {
      const admin = await prisma.adminUser.findUnique({
        where: { email: data.email },
      });

      if (admin) {
        // Verify admin password
        const isValid = await comparePassword(data.password, admin.passwordHash);
        if (!isValid) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate tokens for admin
        const payload: JWTPayload = {
          userId: admin.id,
          email: admin.email,
          role: 'admin', // Admin role for admin users
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return res.json({
          user: {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            grade: null,
            avatarUrl: null,
            role: 'admin',
          },
          accessToken,
          refreshToken,
        });
      }

      // Not found in both tables
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // User found in users table - verify password
    const isValid = await comparePassword(data.password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens for user
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        grade: user.grade,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    // Pass error to error handler middleware instead of throwing
    return res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : (error as Error).message 
    });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const { verifyRefreshToken } = await import('../utils/jwt.js');
    const payload = verifyRefreshToken(refreshToken);

    // Generate new tokens
    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
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

    res.json({ user });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : (error as Error).message 
    });
  }
}

const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  grade: z.number().int().min(1).max(5).optional(),
});

export async function updateProfile(req: Request, res: Response) {
  try {
    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.grade !== undefined && { grade: data.grade }),
      },
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

    res.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    throw error;
  }
}

export async function logout(req: Request, res: Response) {
  // JWT is stateless, so logout is handled client-side by removing tokens
  // Optionally, we can maintain a blacklist of tokens in Redis
  res.json({ message: 'Logged out successfully' });
}

