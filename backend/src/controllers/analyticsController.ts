import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';

const trackSchema = z.object({
  eventType: z.string(),
  eventData: z.record(z.any()).optional(),
  sessionId: z.string().optional(),
});

export async function trackEvent(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const data = trackSchema.parse(req.body);

    const analytics = await prisma.userAnalytics.create({
      data: {
        userId,
        eventType: data.eventType,
        eventData: data.eventData || {},
        sessionId: data.sessionId,
        ipAddress: req.ip || req.socket.remoteAddress || undefined,
        userAgent: req.headers['user-agent'] || undefined,
      },
    });

    res.status(201).json({ success: true, analytics });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    throw error;
  }
}

