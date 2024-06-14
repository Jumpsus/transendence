export async function compressImage(file) {
  const targetWidth = 70;
  const targetHeight = 70;

  // Create an image element to load the file
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);

  // Wait for the image to load
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // Calculate the cropping dimensions
  const aspectRatio = img.width / img.height;
  let cropWidth, cropHeight;

  if (aspectRatio > 1) {
    // Image is wider than tall
    cropHeight = img.height;
    cropWidth = img.height * (targetWidth / targetHeight);
  } else {
    // Image is taller than wide or square
    cropWidth = img.width;
    cropHeight = img.width * (targetHeight / targetWidth);
  }

  // Calculate the cropping coordinates to center the crop area
  const cropX = (img.width - cropWidth) / 2;
  const cropY = (img.height - cropHeight) / 2;

  // Create a canvas and draw the cropped area
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    img,
    cropX,
    cropY,
    cropWidth,
    cropHeight, // Source rectangle
    0,
    0,
    targetWidth,
    targetHeight // Destination rectangle
  );

  // Convert canvas to Blob
  const blob = await new Promise(
    (resolve) => canvas.toBlob(resolve, file.type, 0.9) // 0.9 is the quality factor (adjust if necessary)
  );

  // Convert Blob to File
  return new File([blob], file.name, {
    type: blob.type,
  });
}