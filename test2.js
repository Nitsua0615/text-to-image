const fs = require("fs");
const PNG = require("pngjs").PNG;

class SimplePNG {
    constructor(width, height) {
        this.png = new PNG({
            width,
            height
        });
    }

    setPixel(x, y, r, g, b) {
        const idx = (this.png.width * y + x) << 2;
        this.png.data[idx] = r;
        this.png.data[idx + 1] = g;
        this.png.data[idx + 2] = b;
        this.png.data[idx + 3] = 255;
    }

    saveToFile(filename) {
        this.png.pack().pipe(fs.createWriteStream(filename));
        console.log(`PNG image created: ${filename}`);
    }
}

const content = fs.readFileSync("./test.txt", "utf8");

const codes = [];

for (let index = 0; index < content.length; index++) {
    let charcode = content.charCodeAt(index);

    if (charcode === 1 || charcode === 2) throw new Error("charcode is 1 or 2. The encoder cannot work with this.");
    if (charcode > 255) {
        codes.push(1);
        while (charcode > 255) {
            codes.push(255);
            charcode -= 255;
        }
        codes.push(charcode);
        codes.push(2);
    } else {
        codes.push(charcode);
    }
}

const width = Math.ceil(Math.sqrt(codes.length / 3));
const height = Math.ceil(codes.length / (3 * width));

const myPNG = new SimplePNG(width, height);

let idx = 0;
for (let i = 0; i < codes.length; i += 3) {
    const r = codes[i];
    const g = codes[i + 1];
    const b = codes[i + 2];

    myPNG.setPixel(idx % width, Math.floor(idx / width), r ? r : 0, g ? g : 0, b ? b : 0);
    idx++;
}

myPNG.saveToFile("test.png");

fs.createReadStream("test.png").pipe(new PNG()).on("parsed", (data) => {
    let out = "";

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        out += String.fromCharCode(r) + String.fromCharCode(g) + String.fromCharCode(b);
    }

    console.log(out);
});
