import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';

const awardCoinsSchema = z.object({
  amount: z.number().int().positive(),
  reason: z.string(),
  metadata: z.record(z.any()).optional(),
});

// Lấy số coins của user
export async function getUserCoins(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ coins: user.coins });
  } catch (error) {
    console.error('Error getting user coins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Tặng coins cho user
export async function awardCoins(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const data = awardCoinsSchema.parse(req.body);

    // Kiểm tra user tồn tại
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cập nhật coins và tạo transaction
    const result = await prisma.$transaction(async (tx) => {
      // Cập nhật coins
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          coins: {
            increment: data.amount,
          },
        },
        select: { coins: true },
      });

      // Tạo transaction record
      await tx.coinTransaction.create({
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
      coins: result.coins,
      awarded: data.amount,
      reason: data.reason,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error awarding coins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Lấy lịch sử giao dịch coins
export async function getCoinTransactions(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const transactions = await prisma.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Error getting coin transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

