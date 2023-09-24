const { PNG } = require('pngjs');
const Compressor = require('./compressor'); // Replace with the correct path to your Compressor module

async function main() {
  const compressor = new Compressor();

  // Compress text
  const textToCompress = 'Hello, this is some text to compress!💀💀💀 aaa';
  const compressedData = compressor.compress(textToCompress);

  // Save compressed data as a PNG image
  const compressedImagePath = await compressedData.toImage('compressed.png');
  console.log(`Compressed image saved as: ${compressedImagePath}`);
  console.log(compressedImagePath)
  // Decompress data from the saved image
  await compressor.decompressImage(compressedImagePath, (a) => {
    console.log(`Decompressed Text: ${a}`);
  });
}

main().catch(err => {
  console.error('Error:', err);
});