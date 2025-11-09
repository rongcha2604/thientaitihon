import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';

export async function trackAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Skip tracking for admin routes and analytics endpoint itself
  if (req.path.startsWith('/api/admin') || req.path === '/api/analytics/track') {
    return next();
  }

  // Track after response is sent
  res.on('finish', async () => {
    try {
      const userId = req.user?.userId;
      if (!userId) return; // Skip if not authenticated

      const eventType = `${req.method} ${req.path}`;
      const eventData = {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        query: req.query,
      };

      await prisma.userAnalytics.create({
        data: {
          userId,
          eventType,
          eventData,
          sessionId: req.headers['x-session-id'] as string || undefined,
          ipAddress: req.ip || req.socket.remoteAddress || undefined,
          userAgent: req.headers['user-agent'] || undefined,
        },
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw - analytics should not break the app
    }
  });

  next();
}

