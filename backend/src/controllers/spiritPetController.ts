import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';

const unlockPetSchema = z.object({
  spiritPetId: z.string().uuid(),
});

const upgradePetSchema = z.object({
  userSpiritPetId: z.string().uuid(),
});

// Lấy danh sách tất cả linh vật
export async function getSpiritPets(req: Request, res: Response) {
  try {
    const pets = await prisma.spiritPet.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    });

    res.json({ pets });
  } catch (error) {
    console.error('Error getting spirit pets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Lấy linh vật user đã sở hữu
export async function getUserSpiritPets(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const userPets = await prisma.userSpiritPet.findMany({
      where: { userId },
      include: {
        spiritPet: true,
      },
      orderBy: { unlockedAt: 'asc' },
    });

    res.json({ pets: userPets });
  } catch (error) {
    console.error('Error getting user spirit pets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Unlock linh vật cấp 1
export async function unlockSpiritPet(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const data = unlockPetSchema.parse(req.body);

    // Lấy user và kiểm tra sao
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Lấy linh vật
    const spiritPet = await prisma.spiritPet.findUnique({
      where: { id: data.spiritPetId },
    });

    if (!spiritPet) {
      return res.status(404).json({ error: 'Spirit pet not found' });
    }

    if (!spiritPet.isActive) {
      return res.status(400).json({ error: 'Spirit pet is not available' });
    }

    // Kiểm tra đã unlock chưa
    const existing = await prisma.userSpiritPet.findUnique({
      where: {
        userId_spiritPetId: {
          userId,
          spiritPetId: data.spiritPetId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Spirit pet already unlocked' });
    }

    // Lấy level 1 để check unlock cost
    const levels = spiritPet.levels as any[];
    const level1 = levels.find((l) => l.star === 1);

    if (!level1) {
      return res.status(400).json({ error: 'Invalid spirit pet levels' });
    }

    const unlockCost = level1.unlock_cost?.STAR || 50;

    // Kiểm tra đủ sao không
    if (user.stars < unlockCost) {
      return res.status(400).json({
        error: 'Not enough stars',
        required: unlockCost,
        current: user.stars,
      });
    }

    // Transaction: Trừ sao + unlock linh vật + tạo star transaction
    const result = await prisma.$transaction(async (tx) => {
      // Trừ sao
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          stars: {
            decrement: unlockCost,
          },
        },
      });

      // Unlock linh vật
      const userPet = await tx.userSpiritPet.create({
        data: {
          userId,
          spiritPetId: data.spiritPetId,
          currentLevel: 1,
          isActive: false, // Mặc định không active
          unlockedAt: new Date(),
        },
        include: {
          spiritPet: true,
        },
      });

      // Tạo star transaction
      await tx.starTransaction.create({
        data: {
          userId,
          amount: -unlockCost,
          reason: 'unlock_pet',
          metadata: {
            spiritPetId: data.spiritPetId,
            spiritPetCode: spiritPet.code,
            level: 1,
          },
        },
      });

      return { user: updatedUser, userPet };
    });

    res.json({
      message: 'Spirit pet unlocked successfully',
      userPet: result.userPet,
      remainingStars: result.user.stars,
    });
  } catch (error) {
    console.error('Error unlocking spirit pet:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Nâng cấp linh vật
export async function upgradeSpiritPet(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const data = upgradePetSchema.parse(req.body);

    // Lấy user và kiểm tra sao
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Lấy user spirit pet
    const userPet = await prisma.userSpiritPet.findUnique({
      where: { id: data.userSpiritPetId },
      include: {
        spiritPet: true,
      },
    });

    if (!userPet) {
      return res.status(404).json({ error: 'User spirit pet not found' });
    }

    if (userPet.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Kiểm tra đã đạt cấp tối đa chưa
    if (userPet.currentLevel >= userPet.spiritPet.maxStars) {
      return res.status(400).json({ error: 'Spirit pet already at max level' });
    }

    // Lấy level tiếp theo
    const levels = userPet.spiritPet.levels as any[];
    const nextLevel = userPet.currentLevel + 1;
    const nextLevelData = levels.find((l) => l.star === nextLevel);

    if (!nextLevelData) {
      return res.status(400).json({ error: 'Invalid next level' });
    }

    const upgradeCost = nextLevelData.unlock_cost?.STAR || 0;

    if (upgradeCost === 0) {
      return res.status(400).json({ error: 'Invalid upgrade cost' });
    }

    // Kiểm tra đủ sao không
    if (user.stars < upgradeCost) {
      return res.status(400).json({
        error: 'Not enough stars',
        required: upgradeCost,
        current: user.stars,
      });
    }

    // Transaction: Trừ sao + nâng cấp + tạo star transaction
    const result = await prisma.$transaction(async (tx) => {
      // Trừ sao
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          stars: {
            decrement: upgradeCost,
          },
        },
      });

      // Nâng cấp
      const upgradedPet = await tx.userSpiritPet.update({
        where: { id: data.userSpiritPetId },
        data: {
          currentLevel: nextLevel,
          lastUpgradedAt: new Date(),
        },
        include: {
          spiritPet: true,
        },
      });

      // Tạo star transaction
      await tx.starTransaction.create({
        data: {
          userId,
          amount: -upgradeCost,
          reason: 'upgrade_pet',
          metadata: {
            userSpiritPetId: data.userSpiritPetId,
            spiritPetId: userPet.spiritPetId,
            spiritPetCode: userPet.spiritPet.code,
            fromLevel: userPet.currentLevel,
            toLevel: nextLevel,
          },
        },
      });

      return { user: updatedUser, userPet: upgradedPet };
    });

    res.json({
      message: 'Spirit pet upgraded successfully',
      userPet: result.userPet,
      remainingStars: result.user.stars,
    });
  } catch (error) {
    console.error('Error upgrading spirit pet:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Toggle active linh vật (equip/unequip)
export async function toggleActiveSpiritPet(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const data = z.object({ userSpiritPetId: z.string().uuid() }).parse(req.body);

    const userPet = await prisma.userSpiritPet.findUnique({
      where: { id: data.userSpiritPetId },
    });

    if (!userPet) {
      return res.status(404).json({ error: 'User spirit pet not found' });
    }

    if (userPet.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Nếu đang active → unequip, nếu không → equip (và unequip các linh vật khác)
    const newActiveState = !userPet.isActive;

    await prisma.$transaction(async (tx) => {
      if (newActiveState) {
        // Unequip tất cả linh vật khác
        await tx.userSpiritPet.updateMany({
          where: {
            userId,
            id: { not: data.userSpiritPetId },
          },
          data: {
            isActive: false,
          },
        });
      }

      // Toggle active state
      await tx.userSpiritPet.update({
        where: { id: data.userSpiritPetId },
        data: {
          isActive: newActiveState,
        },
      });
    });

    res.json({
      message: newActiveState ? 'Spirit pet equipped' : 'Spirit pet unequipped',
      isActive: newActiveState,
    });
  } catch (error) {
    console.error('Error toggling active spirit pet:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

