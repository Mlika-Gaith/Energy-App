const Tesseract = require('tesseract.js');
const sharp = require('sharp');
// original image
let originalImage = './images/avatar.jpg';

// file name for cropped image
let outputImage = 'croppedImage.jpg';
async function getMetadata() {
  const metadata = await sharp(originalImage).metadata();
  console.log(metadata);
  try {
    await sharp(originalImage)
      .extract({width: 850, height: 580, left: 0, top: 0})
      .rotate()
      .grayscale()
      .toFile('./images/sammy-cropped.jpg');
  } catch (error) {
    console.log(error);
  }
}
getMetadata();
Tesseract.recognize('./images/sammy-cropped.jpg', 'eng', {
  logger: m => console.log(m),
}).then(({data: {text}}) => {
  console.log(text);
});
