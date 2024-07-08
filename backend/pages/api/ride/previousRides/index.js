import { PrismaClient, RideStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }


  const {token}=req.body;

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    // Verify JWT token
    const decodedToken = jwt.verify(token, jwtSecret);
    const { userId } = decodedToken;

    // Fetch all rides for the user where status is ACCEPTED or COMPLETED
    const rides = await prisma.ride.findMany({
      where: {
        OR: [
          { requesterId: userId, status: RideStatus.ACCEPTED },
          { requesterId: userId, status: RideStatus.COMPLETED },
        ],
      },
    });

    res.status(200).json({ rides });
  } catch (error) {
    console.error('Error fetching previous rides:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
