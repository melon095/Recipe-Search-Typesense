/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Recipes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Recipes_slug_key" ON "Recipes"("slug");
