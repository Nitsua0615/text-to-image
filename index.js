import { createWriteStream, readFileSync, createReadStream } from "fs";
import { PNG } from "pngjs";

function encodeTextToImage(data, filename) {
    const width = Math.ceil(Math.sqrt(data.length / 4));
    const height = Math.ceil(data.length / (4 * width));
    const png = new PNG({ width, height });

    for (let i = 0; i < data.length; i += 4) {
        for (let offset = 0; offset < 4; offset++) {
            const dataIndex = ((png.width * Math.floor(i / (4 * width)) + (i / 4) % width) << 2) + offset;
            if (dataIndex >= data.length) continue;
            png.data[dataIndex] = data.readUInt8(i + offset);
        }
    }
    png.pack().pipe(createWriteStream(filename));
}

const data = readFileSync("./test.txt");
encodeTextToImage(data, "test.png");

createReadStream("test.png").pipe(new PNG()).on("parsed", (data) => {
    console.log(data, data.toString());
    console.log(new Uint8Array(data));
});