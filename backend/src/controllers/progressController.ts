import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import type { UserProgressInput } from '../types/index.js';

const progressSchema = z.object({
  bookSeries: z.string(),
  grade: z.number().int().min(1).max(5),
  subject: z.string(),
  week: z.number().int().min(1).max(35),
  lessonId: z.string(),
  status: z.enum(['completed', 'in_progress', 'locked']),
  score: z.number().int().min(0).max(100).optional(),
});

export async function getProgress(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { bookSeries, grade, subject, week } = req.query;

    const where: any = { userId };

    if (bookSeries) where.bookSeries = bookSeries;
    if (grade) where.grade = parseInt(grade as string);
    if (subject) where.subject = subject;
    if (week) where.week = parseInt(week as string);

    const progress = await prisma.userProgress.findMany({
      where,
      orderBy: [
        { bookSeries: 'asc' },
        { grade: 'asc' },
        { subject: 'asc' },
        { week: 'asc' },
      ],
    });

    res.json({ progress });
  } catch (error) {
    throw error;
  }
}

export async function saveProgress(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const data = progressSchema.parse(req.body);

    // Check if progress exists
    const existing = await prisma.userProgress.findFirst({
      where: {
        userId,
        bookSeries: data.bookSeries,
        grade: data.grade,
        subject: data.subject,
        week: data.week,
        lessonId: data.lessonId,
      },
    });

    let progress;

    if (existing) {
      // Update existing
      progress = await prisma.userProgress.update({
        where: { id: existing.id },
        data: {
          status: data.status,
          score: data.score,
          completedAt: data.status === 'completed' ? new Date() : existing.completedAt,
        },
      });
    } else {
      // Create new
      progress = await prisma.userProgress.create({
        data: {
          userId,
          ...data,
          completedAt: data.status === 'completed' ? new Date() : null,
        },
      });
    }

    res.status(existing ? 200 : 201).json({ progress });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    throw error;
  }
}

export async function getProgressByWeek(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const week = parseInt(req.params.week);

    const progress = await prisma.userProgress.findMany({
      where: {
        userId,
        week,
      },
      orderBy: [
        { subject: 'asc' },
        { lessonId: 'asc' },
      ],
    });

    res.json({ progress });
  } catch (error) {
    throw error;
  }
}

