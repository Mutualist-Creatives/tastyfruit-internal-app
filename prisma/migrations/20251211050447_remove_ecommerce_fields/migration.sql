/*
  Warnings:

  - You are about to drop the column `bgGradient` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `characterSlug` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `fruitCardImage` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `fruitCardType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `gesture` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `layoutType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "bgGradient",
DROP COLUMN "category",
DROP COLUMN "characterSlug",
DROP COLUMN "fruitCardImage",
DROP COLUMN "fruitCardType",
DROP COLUMN "gesture",
DROP COLUMN "imageUrl",
DROP COLUMN "isActive",
DROP COLUMN "layoutType",
DROP COLUMN "price",
DROP COLUMN "stock";
