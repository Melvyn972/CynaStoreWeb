import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/next-auth';
import jwt from 'jsonwebtoken';
import prisma from '@/libs/prisma';

export async function getAuthenticatedUser(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    // Récupérer l'utilisateur depuis la base de données car session.user.id n'existe pas par défaut
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
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
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "your-secret-key");
      
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
    }
  }

  return null;
}

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

    request.user = user;
    
    return handler(request, context);
  };
}

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
        JSON.stringify({ message: 'Forbidden' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    request.user = user;
    
    return handler(request, context);
  };
} 