// pages/api/getUser.js

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { jwttoken } = req.body;

  try {
    // Verify and decode JWT token
    const decoded = jwt.verify(jwttoken, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user details using Prisma
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      // Specify fields you want to include in the response
      select: {
        id: true,
        email: true,
        phone: true,
        fullname: true,
        address: true,
        dob: true,
        userType: true,
        previousRides: true,
        ridesAsDriver: true,
        rating: true,
        comments: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
