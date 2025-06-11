import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import jwt from 'jsonwebtoken';
import prisma from '@/libs/prisma';

/**
 * Authentication middleware that supports both NextAuth sessions and JWT Bearer tokens
 * This allows the same API endpoints to work for both web app (NextAuth) and mobile app (JWT)
 */
export async function getAuthenticatedUser(request) {
  // First try NextAuth session (for web app)
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role || 'USER',
    };
  }

  // Then try JWT Bearer token (for mobile app)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "your-secret-key");
      
      // Get full user data from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        }
      });

      if (user) {
        return user;
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
      // Invalid token, fall through to return null
    }
  }

  return null;
}

/**
 * Middleware wrapper for API routes that require authentication
 */
export function withAuth(handler) {
  return async function(request, context) {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    // Add user to request context
    request.user = user;
    
    return handler(request, context);
  };
}

/**
 * Middleware wrapper for API routes that require admin role
 */
export function withAdminAuth(handler) {
  return async function(request, context) {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (user.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ message: 'Forbidden - Admin access required' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Add user to request context
    request.user = user;
    
    return handler(request, context);
  };
} 