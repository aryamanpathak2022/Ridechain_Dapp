import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rideId } = req.body;

  try {
    // Find all comments for the specified rideId
    const comments = await prisma.comment.findMany({
      where: {
        rideId: parseInt(rideId, 10),
      }
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
