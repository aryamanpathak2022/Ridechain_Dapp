import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const rides = await prisma.ride.findMany({
      where: {
        status: 'REQUESTED',
      },
      include: {
        requester: true,  // Include requester details if needed
        driver: true,     // Include driver details if needed
        comments: true,   // Include comments if needed
      },
    });
    console.log(rides);

    res.status(200).json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the rides' });
  } finally {
    await prisma.$disconnect();
  }
}
