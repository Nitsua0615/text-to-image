import { createWriteStream, readFileSync, createReadStream } from "fs";
import { PNG } from "pngjs";

function encodeTextToImage(data, filename) {
    return new Promise((resolve) => {
        const pixelCount = Math.ceil(data.length / 3);
        let targetWidth = Math.ceil(Math.sqrt(pixelCount));

        for (let width = targetWidth; width > 1; --width) {
            if (width * Math.ceil(pixelCount / width) - pixelCount < targetWidth * Math.ceil(pixelCount / targetWidth) - pixelCount) {
                targetWidth = width;
            }
            if (width * Math.ceil(pixelCount / width) - pixelCount === 0) break;
        }

        const targetHeight = Math.round(pixelCount / targetWidth);
        const png = new PNG({ width: targetWidth, height: targetHeight });

        for (let dataIdx = 0, i = 0; i < data.length; i += 3, dataIdx++) {
            const [r, g, b] = data.slice(i, i + 3);
            const idx = (png.width * (Math.floor(dataIdx / targetWidth)) + (dataIdx % targetWidth)) << 2;
            png.data[idx] = r;
            png.data[idx + 1] = g;
            png.data[idx + 2] = b;
            png.data[idx + 3] = 255;
        }

        png.pack().pipe(createWriteStream(filename)).on("finish", () => {
            console.log(`Width: ${png.width}\nHeight: ${png.height}\nData: ${Buffer.from(png.data).filter(b => b !== 255 && b !== 0).toString()}`);
            resolve(true);
        });
    });
}

const data = readFileSync("./test.txt");
await encodeTextToImage(data, `output.png`);

createReadStream("output.png")
    .pipe(new PNG())
    .on("parsed", (data) => {
        console.log("-\nLoad:\n" + Buffer.from(data).filter(b => b !== 255 && b !== 0).toString());
    });
