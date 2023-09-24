import https from "https";
import {
    PNG
} from "pngjs";

// URL of the image you want to fetch
const imageUrl = 'https://raw.githubusercontent.com/Nitsua0615/text-to-image/main/output.png';

// Function to download the image from the URL
function downloadImage(url, callback) {
    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            callback(new Error(`Failed to fetch the image. Status code: ${response.statusCode}`));
            return;
        }

        const chunks = [];
        response.on('data', (chunk) => {
            chunks.push(chunk);
        });

        response.on('end', () => {
            const buffer = Buffer.concat(chunks);
            callback(null, buffer);
        });
    });
}

// Function to parse the image using pngjs
function parseImage(buffer, callback) {
    const png = new PNG();
    png.parse(buffer, (error, data) => {
        if (error) {
            callback(error);
            return;
        }

        callback(null, data);
    });
}

// Usage example
downloadImage(imageUrl, (downloadError, imageBuffer) => {
    if (downloadError) {
        console.error(`Error downloading image: ${downloadError.message}`);
        return;
    }

    parseImage(imageBuffer, (parseError, imageData) => {
        if (parseError) {
            console.error(`Error parsing image: ${parseError.message}`);
            return;
        }

        // Now you can work with the imageData, which contains the image pixels and metadata
        console.log('Image width:', imageData.width);
        console.log('Image height:', imageData.height);
        console.log('Pixel data:', imageData.data);
        console.log('To text:', imageData.data.toString());

        // console.log(imageData.data);
    });
});