import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';

const awardStarsSchema = z.object({
  amount: z.number().int().positive(),
  reason: z.string(),
  metadata: z.record(z.any()).optional(),
});

// Lấy số sao của user
export async function getUserStars(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stars: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ stars: user.stars });
  } catch (error) {
    console.error('Error getting user stars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Tặng sao cho user
export async function awardStars(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const data = awardStarsSchema.parse(req.body);

    // Kiểm tra user tồn tại
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cập nhật sao và tạo transaction
    const result = await prisma.$transaction(async (tx) => {
      // Cập nhật sao
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          stars: {
            increment: data.amount,
          },
        },
        select: { stars: true },
      });

      // Tạo transaction record
      await tx.starTransaction.create({
        data: {
          userId,
          amount: data.amount,
          reason: data.reason,
          metadata: data.metadata || {},
        },
      });

      return updatedUser;
    });

    res.json({
      stars: result.stars,
      awarded: data.amount,
      reason: data.reason,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error awarding stars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Lấy lịch sử giao dịch sao
export async function getStarTransactions(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const transactions = await prisma.starTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Error getting star transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

