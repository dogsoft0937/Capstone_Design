-- AlterTable
ALTER TABLE `Port` ADD COLUMN `lastChecked` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);