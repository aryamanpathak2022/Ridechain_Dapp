import { PrismaClient, RideStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, pickup, drop, price, duration, driverId, rideId } = req.body;

  try {
    // Verify JWT token
    const decodedToken = jwt.verify(token, jwtSecret);
    const { userId: requesterId } = decodedToken;

    // Find requester by ID
    const requester = await prisma.user.findUnique({
      where: {
        id: requesterId,
      },
    });

    if (!requester) {
      return res.status(404).json({ error: 'Requester not found' });
    }

    // Create a new ride entry
    const newRide = await prisma.ride.create({
      data: {
        rideId: rideId, // Use the provided ride ID
        requester: {
          connect: { id: requesterId },
        },
        pickupLoc: pickup,
        dropoffLoc: drop,
        price: parseFloat(price), // Parse price as float (assuming price is a string in JSON)
        status: RideStatus.REQUESTED,
        duration: parseInt(duration), // Parse duration as integer (assuming duration is a string in JSON)
        driver: {
          connect: { id: parseInt(driverId) },
        },
      },
    });

    res.status(201).json({ message: 'Ride requested successfully', ride: newRide });
  } catch (error) {
    console.error('Error requesting ride:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
