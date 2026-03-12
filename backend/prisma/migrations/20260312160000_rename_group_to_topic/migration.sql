-- Rename table Group to Topic
ALTER TABLE "Group" RENAME TO "Topic";

-- Rename primary key constraint
ALTER TABLE "Topic" RENAME CONSTRAINT "Group_pkey" TO "Topic_pkey";

-- Rename column groupId to topicId on Post
ALTER TABLE "Post" RENAME COLUMN "groupId" TO "topicId";

-- Rename foreign key constraint
ALTER TABLE "Post" RENAME CONSTRAINT "Post_groupId_fkey" TO "Post_topicId_fkey";
