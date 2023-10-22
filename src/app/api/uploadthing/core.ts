import { protectedProcedure } from "@/server/api/trpc";
import { getServerAuthSession } from "@/server/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
// const auth = (req: Request) => getServerAuthSession();
// const session = await getServerAuthSession();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      //   const user = await auth(req);
      const session = await getServerAuthSession();
      // const user = {getServerAuthSession}

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session?.user.id, userName: session?.user.name };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log(
        "Upload complete for user:",
        metadata.userName,
        "| id:",
        metadata.userId,
      );

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
