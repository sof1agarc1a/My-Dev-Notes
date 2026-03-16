/*
  Warnings:

  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('heading', 'text', 'image', 'code', 'divider');

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_postId_fkey";

-- DropTable
DROP TABLE "Section";

-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "type" "BlockType" NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "codeLanguage" TEXT,
    "imageUrl" TEXT,
    "order" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Block_postId_idx" ON "Block"("postId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
