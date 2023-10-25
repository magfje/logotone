"use client";
import { UploadDropzone } from "@/utils/uploadthing";
import imglyRemoveBackground, { type Config } from "@imgly/background-removal";
import Image from "next/image";
import { useState } from "react";
import * as _Jimp from "jimp";
import createDuotoneEffect from "@/utils/createDuotone";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const Jimp = typeof self !== "undefined" ? self.Jimp || _Jimp : _Jimp;

interface ImageInfo {
  name: string;
  url: string;
  size: number;
  modifiedUrl?: string;
  progress?: string;
  whiteUrl?: string;
  blackUrl?: string;
}

export default function ExampleUploader() {
  const [images, setImages] = useState<ImageInfo[]>([]);

  const handleImageUpload = (newImages: ImageInfo[]) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
    console.log(images);
  };

  const handleBgRemoval = async (index: number) => {
    const imageInfo = images[index];
    const imageSrc = imageInfo?.url;

    const config: Config = {
      progress: (key, current, total) => {
        const progressString = `Downloading ${key}: ${current} of ${total}`;
        console.log(progressString);
        const updatedImages = [...images];
        updatedImages[index] = { ...imageInfo, progress: progressString };
        setImages(updatedImages);
      },
    };

    try {
      const blob = await imglyRemoveBackground(imageSrc, config);
      const url = URL.createObjectURL(blob);

      const updatedImages = [...images];
      updatedImages[index] = {
        ...imageInfo,
        modifiedUrl: url,
        progress: undefined,
      }; // Clear progress after the background removal is complete
      setImages(updatedImages);
    } catch (error) {
      console.error("Error while removing the background:", error);
    }
  };

  const handleColorTone = async (src, color: string, index: number) => {
    // const MIME = Jimp.MIME_PNG;
    // const imageInfo = images[index];
    // await Jimp.read(src)
    //   .then((image) => {
    //     return image
    //       .color([
    //         { apply: color === "white" ? "lighten" : "darken", params: [100] },
    //       ])
    //       .getBase64Async(MIME)
    //       .then((src) => {
    //         const updatedImages = [...images];
    //         if (color === "white") {
    //           updatedImages[index] = { ...imageInfo, whiteUrl: src };
    //         }
    //         if (color === "black") {
    //           updatedImages[index] = { ...imageInfo, blackUrl: src };
    //         }
    //         setImages(updatedImages);
    //       })
    //       .catch((err) => console.log("saveError", err));
    //   })
    //   .catch((err) => {
    //     console.log("ToneError: ", err);
    //   });
    const imageInfo = images[index];
    const primCol = color == "white" ? "#ffffff" : "#000000";
    const secCol = color == "white" ? "#000000" : "#ffffff";
    const updatedImages = [...images];
    // const dtImg = createDuotone(src, primCol, secCol);

    createDuotoneEffect(src, primCol, secCol, function (duotoneImageUrl) {
      color === "white"
        ? (updatedImages[index] = { ...imageInfo, whiteUrl: duotoneImageUrl })
        : (updatedImages[index] = { ...imageInfo, blackUrl: duotoneImageUrl });

      setImages(updatedImages);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-slate-300 p-24">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          handleImageUpload(res);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      <div className="flex flex-col gap-5">
        {images.map((image, index) => (
          <div
            key={image.name}
            className="flex items-center justify-between gap-5 rounded-lg bg-slate-200 p-10 text-center"
          >
            <div className="flex h-72 flex-col items-center justify-start">
              <div className="relative h-52 w-52 object-cover">
                <Image src={image.url} alt={image.name} fill={true} />
              </div>
              <span className="w-48 text-sm">
                <p>{image.name}</p>
                <p>{`(${image.size}b)`}</p>
              </span>
              {/* <button
                className="rounded-lg bg-blue-400 p-3 text-white"
                onClick={() => handleColorTone(image.url, "white")}
              >
                white
              </button>
              <button
                className="rounded-lg bg-blue-400 p-3 text-white"
                onClick={() => handleColorTone(image.url, "black")}
              >
                black
              </button> */}
            </div>
            {image.progress ?? image.modifiedUrl ? (
              ""
            ) : (
              <>
                <button
                  className="rounded-lg bg-blue-400 p-3 text-white"
                  onClick={() => handleBgRemoval(index)}
                >
                  Remove BG
                </button>
                {/* <button
                  className="rounded-lg bg-blue-400 p-3 text-white"
                  onClick={() => handleColorTone(image.url, "white", index)}
                >
                  whiten
                </button>
                <button
                  className="rounded-lg bg-blue-400 p-3 text-white"
                  onClick={() => handleColorTone(image.url, "black", index)}
                >
                  blacken
                </button> */}
              </>
            )}

            {image.progress && (
              <div className="text-blue-400">{image.progress}</div>
            )}
            {image.modifiedUrl && (
              <>
                <div className="flex h-72 flex-col items-center justify-start">
                  <div className="relative h-52 w-52 object-cover">
                    <Image
                      src={image.modifiedUrl}
                      alt={`${image.name} (BG Removed)`}
                      fill={true}
                      blurDataURL={image.url}
                      placeholder={"blur"}
                    />
                  </div>
                  <span>
                    <p className="w-48 text-sm">{`${image.name} (BG Removed)`}</p>
                  </span>
                </div>
              </>
            )}
            {image.whiteUrl ? (
              <div className="relative h-40 w-40 bg-black object-cover">
                <Image src={image.whiteUrl} alt={image.name} fill={true} />
              </div>
            ) : (
              <button
                className="rounded-lg bg-blue-400 p-3 text-white"
                onClick={() =>
                  handleColorTone(
                    image.modifiedUrl ? image.modifiedUrl : image.url,
                    "white",
                    index,
                  )
                }
              >
                whiten
              </button>
            )}
            {image.blackUrl ? (
              <div className="relative h-40 w-40 bg-white object-cover">
                <Image src={image.blackUrl} alt={image.name} fill={true} />
              </div>
            ) : (
              <button
                className="rounded-lg bg-blue-400 p-3 text-white"
                onClick={() =>
                  handleColorTone(
                    image.modifiedUrl ? image.modifiedUrl : image.url,
                    "black",
                    index,
                  )
                }
              >
                blacken
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
