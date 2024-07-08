/*
  Warnings:

  - Added the required column `authorsId` to the `Recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "authorsId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Authors" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "Authors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authors_name_key" ON "Authors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Authors_email_key" ON "Authors"("email");

-- AddForeignKey
ALTER TABLE "Recipes" ADD CONSTRAINT "Recipes_authorsId_fkey" FOREIGN KEY ("authorsId") REFERENCES "Authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
