/*
  Warnings:

  - You are about to drop the `Photos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Photos" DROP CONSTRAINT "Photos_recipeId_fkey";

-- DropTable
DROP TABLE "Photos";

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Photo_recipeId_key" ON "Photo"("recipeId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
