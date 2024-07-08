/*
  Warnings:

  - You are about to drop the column `recipeId` on the `Tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_recipeId_fkey";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "recipeId";

-- CreateTable
CREATE TABLE "Photos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "Photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RecipesToTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Photos_recipeId_key" ON "Photos"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "_RecipesToTags_AB_unique" ON "_RecipesToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_RecipesToTags_B_index" ON "_RecipesToTags"("B");

-- AddForeignKey
ALTER TABLE "Photos" ADD CONSTRAINT "Photos_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipesToTags" ADD CONSTRAINT "_RecipesToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipesToTags" ADD CONSTRAINT "_RecipesToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
