import { createUploadthing, type FileRouter } from 'uploadthing/next'

const uploadThing = createUploadthing()

export const fileRouter = {
  blockImage: uploadThing({ image: { maxFileSize: '4MB', maxFileCount: 1 } }).onUploadComplete(
    ({ file }) => {
      return { url: file.ufsUrl }
    }
  ),
} satisfies FileRouter

export type OurFileRouter = typeof fileRouter
