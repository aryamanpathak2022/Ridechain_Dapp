/*
  Warnings:

  - A unique constraint covering the columns `[rideId]` on the table `Ride` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ride" ALTER COLUMN "rideId" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Ride_rideId_key" ON "Ride"("rideId");
