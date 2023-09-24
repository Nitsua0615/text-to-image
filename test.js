const fs = require("fs");
const PNG = require("pngjs").PNG;

const rgb0a = 3;

const content = fs.readFileSync("./test.txt");

const width = Math.ceil(Math.sqrt(content.length / rgb0a));
const height = Math.ceil(content.length / (rgb0a * width));

const png = new PNG({
    width,
    height
});

function readColor(buffer, index, num = 4) {
    let rgbOa = [];

    for (let offset = 0; offset < num; offset++) {
        try {
            rgbOa.push(buffer.readUInt8(index + offset));
        } catch (e) {
            rgbOa.push(0);
        }
    }

    return rgbOa;
}

let dataIdx = 0;
for (let i = 0; i < content.length; i += 3) {
    // const [r, g, b, a] = readColor(content, i);
    const [r, g, b, a] = readColor(content, i, 3);

    const idx = (png.width * (Math.floor(dataIdx / width)) + (dataIdx % width)) << 2;
    png.data[idx] = r;
    png.data[idx + 1] = g;
    png.data[idx + 2] = b;
    png.data[idx + 3] = 255//a;

    dataIdx++;
}

png.pack().pipe(fs.createWriteStream("test.png"));

console.log(`Image created with dimensions: ${width}x${height}`);

fs.createReadStream("test.png").pipe(new PNG()).on("parsed", (data) => {
    console.log(data);
    // console.log(data, data.toString());
    // console.log(new Uint8Array(data));
});