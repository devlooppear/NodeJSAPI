import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, PersonalAccessToken } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = 'API_Web_Token';

interface DecodedToken {
  userId: number; // Adjust this type based on the structure of your decoded token
}

// Extend the Request interface to include token and accessToken properties
interface Request extends ExpressRequest {
  token?: DecodedToken;
  accessToken?: PersonalAccessToken;
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the Authorization header

  try {
    const decodedToken: DecodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;

    // Check if the token exists in the database
    const accessToken: PersonalAccessToken | null = await prisma.personalAccessToken.findUnique({
      where: { token },
    });

    if (accessToken) {
      // Attach the decoded token and access token to the request object for use in route handlers
      req.token = decodedToken;
      req.accessToken = accessToken;

      return next();
    }

    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}
