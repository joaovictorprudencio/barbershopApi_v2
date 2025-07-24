
-- CreateTable
CREATE TABLE `Barber` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `numberPhone` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Barber_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Time` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `available` BOOLEAN NOT NULL DEFAULT false,
    `date` DATETIME(3) NOT NULL,
     `time` VARCHAR(191) NOT NULL,
    `nameCustumer` VARCHAR(191) NOT NULL,
    `phoneCustumer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
