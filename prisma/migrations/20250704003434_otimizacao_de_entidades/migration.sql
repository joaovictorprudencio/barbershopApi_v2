/*
  Warnings:

  - You are about to drop the column `userId` on the `time` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nameCustumer` to the `Time` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneCustumer` to the `Time` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `time` DROP FOREIGN KEY `Time_userId_fkey`;

-- DropIndex
DROP INDEX `Time_userId_fkey` ON `time`;

-- AlterTable
ALTER TABLE `time` DROP COLUMN `userId`,
    ADD COLUMN `nameCustumer` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneCustumer` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `user`;
