import twilio from "twilio";
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, email, date, address, fullname,userType } = req.body;

  try {
    // Check if user exists
    let existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    const otp = generateOtp(); // Generate OTP using random logic

    if (existingUser) {
      // User exists, send OTP and save it
      try {
        await twilioClient.messages.create({
          from: twilioPhoneNumber,
          to: phone,
          body: `Your OTP is ${otp}`,
        });

        await prisma.user.update({
          where: {
            phone,
          },
          data: {
            otp, // Save the generated OTP to the user
          },
        });

        res.status(200).json({
          message: 'OTP sent successfully',
        });
      } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Error sending OTP' });
      }
    } else {
      // User doesn't exist, create user and save OTP

      try {
        const dob = new Date(date).toISOString()
        await prisma.user.create({
          data: {
            email,
            phone,
            dob,
            address,
            fullname,
            otp,
            userType // Save the generated OTP to the new user
          },
        });

        await twilioClient.messages.create({
          from: twilioPhoneNumber,
          to: phone,
          body: `Your OTP is ${otp}`,
        });

        res.status(201).json({ message: 'New user created and OTP sent successfully' });
      } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// OTP generation function using random logic for a 6-digit number
function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString(); // Generates a 6-digit OTP
}