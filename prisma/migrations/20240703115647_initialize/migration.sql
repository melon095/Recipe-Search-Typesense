-- CreateTable
CREATE TABLE "Recipes" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "timeEstimate" INTEGER NOT NULL,

    CONSTRAINT "Recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredients" (
    "id" TEXT NOT NULL,
    "amount" VARCHAR(255) NOT NULL,
    "unit" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "Ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructions" (
    "id" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "Instructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "tag" VARCHAR(50) NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipes_name_key" ON "Recipes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_tag_key" ON "Tags"("tag");

-- AddForeignKey
ALTER TABLE "Ingredients" ADD CONSTRAINT "Ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructions" ADD CONSTRAINT "Instructions_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
