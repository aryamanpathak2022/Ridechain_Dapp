import { PrismaClient, RideStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {token, rideId } = req.body;
  

  try {
    // Verify JWT token
    const decodedToken = jwt.verify(token, jwtSecret);
    const { userId: driverId } = decodedToken;

    // Find ride by ID
    const ride = await prisma.ride.findUnique({
      where: {
        rideId: parseInt(rideId),
      },
    });

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Update ride with driver and status
    const updatedRide = await prisma.ride.update({
      where: {
        rideId: rideId,
      },
      data: {
        driver: {
          connect: { id: driverId },
        },
        status: RideStatus.ACCEPTED, // Adjust status as per your application logic
      },
    });

    res.status(200).json({ message: 'Ride received successfully', ride: updatedRide });
  } catch (error) {
    console.error('Error receiving ride:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
