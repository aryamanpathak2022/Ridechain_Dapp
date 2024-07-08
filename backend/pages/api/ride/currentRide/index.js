import { PrismaClient, RideStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {token } = req.body;

  try {
    // Verify JWT token
    const decodedToken = jwt.verify(token, jwtSecret);
    const { userId } = decodedToken;

    // Fetch the latest ride for the user where status is ACCEPTED or REQUESTED
    const latestRide = await prisma.ride.findFirst({
      where: {
        requesterId: userId,
        status: {
          in: [RideStatus.ACCEPTED, RideStatus.REQUESTED],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ ride: latestRide });
  } catch (error) {
    console.error('Error fetching current ride:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
