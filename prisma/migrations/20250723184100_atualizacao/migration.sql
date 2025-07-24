/*
  Warnings:

  - Added the required column `time` to the `Time` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `time` ADD COLUMN `time` VARCHAR(191) NOT NULL;
