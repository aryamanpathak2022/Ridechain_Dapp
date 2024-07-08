-- CreateEnum
CREATE TYPE "rideType" AS ENUM ('CAR', 'BIKE', 'AUTO');

-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "rideType" "rideType" NOT NULL DEFAULT 'CAR';
