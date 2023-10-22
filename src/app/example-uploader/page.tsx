"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import imglyRemoveBackground from "@imgly/background-removal";
import Image from "next/image";
import { useState } from "react";

interface ImageInfo {
  name: string;
  url: string;
  size: number;
}

export default function ExampleUploader() {
  const [srcImg, setSrcImg] = useState<ImageInfo[]>([]);
  const [bgImage, setBgImage] = useState<string[]>([]);

  const handleSrcImg = (src: ImageInfo[]) => {
    setSrcImg((prevSrcImg) => [...prevSrcImg, ...src]);
  };

  const handleBgRemoval = async (index: number) => {
    const image_src = srcImg[index]?.url;

    try {
      const blob = await imglyRemoveBackground(image_src, { progress });
      const url = URL.createObjectURL(blob);

      // Remove the "blob:" prefix and add the modified URL to the bgImage array
      setBgImage((prevBgImg) => [...prevBgImg, url]);
    } catch (error) {
      console.error("Error while removing the background:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-slate-300 p-24">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          handleSrcImg(res);
          // alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      <div className="grid grid-cols-2 gap-5">
        <div>
          {srcImg.length > 0 && (
            <div className="flex flex-col gap-5">
              {srcImg.map((s, index) => (
                <div
                  key={s.name}
                  className="flex items-center justify-center gap-5 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src={s.url}
                      alt={s.name}
                      width={200}
                      height={200}
                      placeholder="blur"
                      blurDataURL="/blur.webp"
                    />
                    <span>
                      {/* <p>{s.name}</p> */}
                      <p>
                        {"("}
                        {s.size}
                        {"b)"}
                      </p>
                    </span>
                  </div>
                  <button
                    className="rounded-lg bg-blue-400 p-3 text-white"
                    onClick={() => handleBgRemoval(index)}
                  >
                    {" "}
                    removeBG{" "}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {bgImage.length > 0 && (
            <div>
              {bgImage.map((s, index) => (
                <div key={s} className="relative">
                  <Image
                    src={s}
                    alt={s}
                    width={200}
                    height={200}
                    unoptimized
                    placeholder="blur"
                    blurDataURL="/blur.webp"
                  />
                  <button
                    className="absolute right-0 top-0 rounded-lg bg-blue-400 p-3 text-white"
                    onClick={() => handleTurnImageBlack(index)}
                  >
                    Black
                  </button>
                  <button
                    className="absolute right-16 top-0 rounded-lg bg-red-400 p-3 text-white"
                    onClick={() => handleTurnImageWhite(index)}
                  >
                    White
                  </button>
                </div>
              ))}
              {/* <Image src={bgImage} alt="lol" width={100} height={100} /> */}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
