import { createWriteStream, readFileSync, createReadStream } from "fs";
import { PNG } from "pngjs";

function encodeTextToImage(data, filename) {
    return new Promise((resolve) => {
        const pixelCount = Math.ceil(data.length / 4);
        let targetWidth = Math.ceil(Math.sqrt(pixelCount));
        let minNulls = (targetWidth * Math.ceil(pixelCount / targetWidth)) - pixelCount;
        
        for (let width = targetWidth; width > 1; --width) {
          let height = Math.ceil(pixelCount / width);
          let nulls = (width * height) - pixelCount; // guaranteed to be >= 0 because of Math.ceil
          if (nulls < minNulls) {
            minNulls = nulls;
            targetWidth = width;
            if (nulls === 0) break; // we can't have nulls equal to 0 without it being less than minNulls
          }
        }
        
        const targetHeight = Math.round(pixelCount / targetWidth); // just in case. i fucking hate IEEE 754

        const png = new PNG({ 
            width: targetWidth, 
            height: targetHeight
        });
    
        for (let i = 0; i < data.length; i += 4) {
            for (let offset = 0; offset < 4; offset++) {
                const dataIndex = ((png.width * Math.floor(i / (4 * targetWidth)) + (i / 4) % targetWidth) << 2) + offset;
                if (dataIndex >= data.length) continue;
                png.data[dataIndex] = data.readUInt8(i + offset);
            }
        }
        
        png.pack().pipe(createWriteStream(filename)).on("finish", () => {
            console.log("Width:", png.width);
            console.log("Height:", png.height);
            console.log("Data:", png.data);
            console.log("Gamma:", png.gamma);
            console.log("Writable:", png.writable);
            console.log("Readable:", png.readable);
            console.log("Text:", png.data.toString());
            resolve(true);
        });
    });
}

const data = readFileSync("./test.txt");
// const data = Buffer.from("This is a test");

await encodeTextToImage(data, `output.png`);

// createReadStream("output.png").pipe(new PNG()).on("parsed", (data) => {
//     console.log(data);
// });