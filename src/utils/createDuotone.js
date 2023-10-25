export default function createDuotoneEffect(
  imageUrl,
  primaryColor,
  secondaryColor,
  callback,
) {
  // Create an image element
  const image = new Image();

  // Set the image source to the provided URL
  image.src = imageUrl;
  image.crossOrigin = "Anonymous";

  // When the image is loaded, apply the duotone effect
  image.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const imageWidth = image.width;
    const imageHeight = image.height;

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0, imageWidth, imageHeight);

    // Get image data from the canvas
    const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);
    const pixels = imageData.data;

    // Convert primary and secondary colors to RGB format
    const primaryColorRGB = hexToRgb(primaryColor);
    const secondaryColorRGB = hexToRgb(secondaryColor);

    // Apply the duotone effect
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];

      // Calculate the grayscale intensity
      const avg = Math.round(0.2126 * red + 0.7152 * green + 0.0722 * blue);

      // Interpolate between primary and secondary colors based on grayscale value
      pixels[i] = interpolate(
        primaryColorRGB.r,
        secondaryColorRGB.r,
        avg / 255,
      );
      pixels[i + 1] = interpolate(
        primaryColorRGB.g,
        secondaryColorRGB.g,
        avg / 255,
      );
      pixels[i + 2] = interpolate(
        primaryColorRGB.b,
        secondaryColorRGB.b,
        avg / 255,
      );
    }

    // Put the modified image data back on the canvas
    ctx.putImageData(imageData, 0, 0);

    // Call the callback function with the duotone image as a data URL
    callback(canvas.toDataURL());
  };
}

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// Helper function to interpolate between two values
function interpolate(value1, value2, ratio) {
  return value1 + (value2 - value1) * ratio;
}
