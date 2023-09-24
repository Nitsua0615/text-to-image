// load https://cdn.jsdelivr.net/npm/pngjs/browser.min.js
const PNG = png.PNG;

const imageUrl = 'https://raw.githubusercontent.com/Nitsua0615/text-to-image/main/output.png';

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                resolve(new Uint8Array(buffer));
            })
            .catch(reject);
    });
}

function parseImage(buffer) {
    return new Promise((resolve, reject) => {
        new PNG().parse(buffer, (error, data) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(data);
        });
    });
}

downloadImage(imageUrl)
    .then(imageBuffer => parseImage(imageBuffer))
    .then(imageData => {
        console.log('Image width:', imageData.width);
        console.log('Image height:', imageData.height);
        console.log('Pixel data:', imageData.data);
        console.log('To text:', imageData.data.toString().replaceAll(String.fromCharCode(0), ""));
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
