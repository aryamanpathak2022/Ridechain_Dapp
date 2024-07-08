import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, otp } = req.body;

  try {
    // Find the user by phone number
    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, phone: user.phone }, jwtSecret, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Clear the OTP from the database after successful verification
    await prisma.user.update({
      where: {
        phone,
      },
      data: {
        otp: "ARYAMAN",
      },
    });

    // Include userType in the response
    res.status(200).json({ token, userType: user.userType });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
