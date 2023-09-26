import https from "https";
import { PNG } from "pngjs";

const USE_PNGJS = !0;

const imageUrl = 'https://raw.githubusercontent.com/Nitsua0615/text-to-image/main/output.png';

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

function parseImage(buffer, callback) {
    if (USE_PNGJS) {
        const png = new PNG();
        png.parse(buffer, (error, data) => {
            if (error) {
                callback(error);
                return;
            }
    
            callback(null, data);
        });
    } else {
        console.log("WARNING:", "Not using PNGJS! This is currently experimental.");
    }
}

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

        console.log('Image width:', imageData.width);
        console.log('Image height:', imageData.height);
        console.log('Pixel data:', imageData.data);
        console.log('To text:\n' + imageData.data.toString().replaceAll(String.fromCharCode(0), ""));
    });
});