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

// export const compressImage = async (
//   file,
//   { quality = 1, type = file.type }
// ) => {
//   // Get as image data
//   const imageBitmap = await createImageBitmap(file);

//   // Draw to canvas
//   const canvas = document.createElement("canvas");
//   canvas.width = imageBitmap.width;
//   canvas.height = imageBitmap.height;
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(imageBitmap, 0, 0);

//   // Turn into Blob
//   const blob = await new Promise((resolve) =>
//     canvas.toBlob(resolve, type, quality)
//   );

//   // Turn Blob into File
//   return new File([blob], file.name, {
//     type: blob.type,
//   });
// };

// // Get the selected file from the file input
// const input = document.querySelector(".my-image-field");
// input.addEventListener("change", async (e) => {
//   // Get the files
//   const { files } = e.target;

//   // No files selected
//   if (!files.length) return;

//   // We'll store the files in this data transfer object
//   const dataTransfer = new DataTransfer();

//   // For every file in the files list
//   for (const file of files) {
//     // We don't have to compress files that aren't images
//     if (!file.type.startsWith("image")) {
//       // Ignore this file, but do add it to our result
//       dataTransfer.items.add(file);
//       continue;
//     }

//     // We compress the file by 50%
//     const compressedFile = await compressImage(file, {
//       quality: 0.5,
//       type: "image/jpeg",
//     });

//     // Save back the compressed file instead of the original file
//     dataTransfer.items.add(compressedFile);
//   }

//   // Set value of the file input to our new files list
//   e.target.files = dataTransfer.files;
// });
