import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';

const purchaseItemSchema = z.object({
  albumItemId: z.string().uuid(),
});

// Lấy danh sách vật phẩm album
export async function getAlbumItems(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const category = req.query.category as string | undefined;

    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }

    // Lấy tất cả vật phẩm
    const items = await prisma.albumItem.findMany({
      where,
      orderBy: [{ category: 'asc' }, { price: 'asc' }],
    });

    // Lấy vật phẩm user đã sở hữu
    const userItems = await prisma.userAlbumItem.findMany({
      where: { userId },
      select: { albumItemId: true },
    });

    const ownedItemIds = new Set(userItems.map((ui) => ui.albumItemId));

    // Thêm thông tin owned vào items
    const itemsWithOwned = items.map((item) => ({
      ...item,
      owned: ownedItemIds.has(item.id),
    }));

    res.json({ items: itemsWithOwned });
  } catch (error) {
    console.error('Error getting album items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Đổi vật phẩm bằng coins
export async function purchaseItem(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const data = purchaseItemSchema.parse(req.body);

    // Kiểm tra user và vật phẩm
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const item = await prisma.albumItem.findUnique({
      where: { id: data.albumItemId },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!item.isActive) {
      return res.status(400).json({ error: 'Item is not available' });
    }

    // Kiểm tra user đã sở hữu vật phẩm chưa
    const existing = await prisma.userAlbumItem.findUnique({
      where: {
        userId_albumItemId: {
          userId,
          albumItemId: data.albumItemId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Item already owned' });
    }

    // Kiểm tra coins đủ không
    if (user.coins < item.price) {
      return res.status(400).json({
        error: 'Insufficient coins',
        required: item.price,
        current: user.coins,
      });
    }

    // Thực hiện giao dịch: Trừ coins, thêm vật phẩm, tạo transaction
    const result = await prisma.$transaction(async (tx) => {
      // Trừ coins
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          coins: {
            decrement: item.price,
          },
        },
        select: { coins: true },
      });

      // Thêm vật phẩm vào collection
      const userItem = await tx.userAlbumItem.create({
        data: {
          userId,
          albumItemId: data.albumItemId,
          purchasedWith: item.price,
        },
        include: {
          albumItem: true,
        },
      });

      // Tạo transaction record
      await tx.coinTransaction.create({
        data: {
          userId,
          amount: -item.price,
          reason: 'purchase_item',
          metadata: {
            albumItemId: data.albumItemId,
            itemName: item.name,
          },
        },
      });

      return { userItem, coins: updatedUser.coins };
    });

    res.json({
      success: true,
      item: result.userItem.albumItem,
      coins: result.coins,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error purchasing item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Lấy vật phẩm user đã sở hữu
export async function getMyItems(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const category = req.query.category as string | undefined;

    const where: any = { userId };
    if (category) {
      where.albumItem = {
        category,
      };
    }

    const userItems = await prisma.userAlbumItem.findMany({
      where,
      include: {
        albumItem: true,
      },
      orderBy: { purchasedAt: 'desc' },
    });

    res.json({ items: userItems.map((ui) => ui.albumItem) });
  } catch (error) {
    console.error('Error getting my items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

