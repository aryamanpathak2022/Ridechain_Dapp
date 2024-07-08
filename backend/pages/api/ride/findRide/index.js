import { PrismaClient, RideStatus } from '@prisma/client';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rideId } = req.body;

  try {
    // Verify JWT token
   

    // Find the ride by rideId
    const ride = await prisma.ride.findUnique({
      where: {
        id: parseInt(rideId, 10),
      },
    });

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check if ride status is ACCEPTED
    if (ride.status === RideStatus.ACCEPTED) {
      return res.status(200).json({ ride });
    }

    // Implement logic for waiting until ride is accepted
    // You can use a loop with a timeout or implement polling on the client side

    // For demonstration purposes, you might return a placeholder or wait message
    res.status(200).json({ message: 'Waiting for ride acceptance...' });

  } catch (error) {
    console.error('Error finding ride:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
