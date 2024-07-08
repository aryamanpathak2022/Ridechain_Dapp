import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {  title, content, rating, rideId } = req.body;

  try {
    // Verify JWT token
    // const decodedToken = jwt.verify(token, jwtSecret);
    const userId  =0;

    // Create a new comment
    const newComment = await prisma.comment.create({
      data: {
        title,
        content,
        rating,
        author: {
          connect: {
            id: userId,
          },
        },
        ride: {
          connect: {
            id: rideId,
          },
        },
      },
    });

    // Find the ride
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: { requester: true, driver: true },
    });

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // let targetUserId;
    // if (ride.requesterId === userId) {
    //   // User is the requester, so update the driver's rating
    //   targetUserId = ride.driverId;
    // } else if (ride.driverId === userId) {
    //   // User is the driver, so update the requester's rating
    //   targetUserId = ride.requesterId;
    // } else {
    //     targetUserId=0
    // //   return res.status(400).json({ error: 'Invalid user' });
    // }

    // // Calculate the new average rating
    // const targetUser = await prisma.user.findUnique({
    //   where: { id: targetUserId },
    //   select: {
    //     rating: true
    //   },
    // });

    // const totalRatings = targetUser.rating;
    // const newAverageRating = (totalRatings + rating) / 2;

    // // Update the target user's rating
    // await prisma.user.update({
    //   where: { id: targetUserId },
    //   data: { rating: newAverageRating },
    // });

    res.status(201).json({ message: 'Comment created and rating updated successfully', comment: newComment });
  } catch (error) {
    console.error('Error creating comment or updating rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
