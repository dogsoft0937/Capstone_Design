/*
  Warnings:

  - You are about to drop the column `traffic` on the `Port` table. All the data in the column will be lost.
  - You are about to alter the column `inboundTraffic` on the `TrafficStat` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `outboundTraffic` on the `TrafficStat` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `portId` to the `TrafficStat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Port` DROP COLUMN `traffic`;

-- AlterTable
ALTER TABLE `TrafficStat` ADD COLUMN `portId` VARCHAR(191) NOT NULL,
    MODIFY `inboundTraffic` INTEGER NOT NULL,
    MODIFY `outboundTraffic` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `TrafficStat` ADD CONSTRAINT `TrafficStat_portId_fkey` FOREIGN KEY (`portId`) REFERENCES `Port`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
