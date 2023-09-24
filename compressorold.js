class Compressor {
    static Color = class {
        constructor(r, g, b, a = 255) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        toPixelData() {
            return new Uint8ClampedArray([this.r, this.g, this.b, this.a]);
        }

        toString() {
            return [this.r, this.g, this.b].join(",");
        }
    };

    static Compressed = class {
        constructor(colors) {
            this.colors = colors;
        }

        toString() {
            return this.colors.map(current => current.toString()).join(",");
        }

        getColorsColor() {
            const colors = this.colors.length;
            let rest = colors;
            const r = Math.floor(rest / 65025);
            rest = rest % 65025;
            const g = Math.floor(rest / 255);
            rest = rest % 255;
            const b = rest;
            return new Compressor.Color(r, g, b);
        }

        getColorsByColor(color) {
            return color.r * 65025 + color.g * 255 + color.b;
        }

        toImage() {
            const size = Math.ceil(Math.sqrt(this.colors.length + 1));
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = size;
            const context = canvas.getContext("2d");
            context.imageSmoothingEnabled = false;
            const headerPixel = this.toPixelData(context, this.getColorsColor());
            context.putImageData(headerPixel, 0, 0);
            const colors = this.colors.length + 1;

            for (let x = 1; x < colors; x++) {
                const location = {
                    x: x % size,
                    y: Math.floor(x / size)
                };
                const pixel = this.toPixelData(context, this.colors[x - 1]);
                context.putImageData(pixel, location.x, location.y);
            }

            return canvas.toDataURL("image/png", 1.0);
        }

        fromImage(image) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const size = image.width;
            canvas.width = canvas.height = size;
            context.drawImage(image, 0, 0, size, size);
            const headerData = context.getImageData(0, 0, 1, 1).data;
            const headerColor = new Compressor.Color(headerData[0], headerData[1], headerData[2]);
            const colors = this.getColorsByColor(headerColor) + 1;
            this.colors = [];

            for (let x = 1; x < colors; x++) {
                const location = {
                    x: x % size,
                    y: Math.floor(x / size)
                };
                const data = context.getImageData(location.x, location.y, 1, 1).data;
                this.colors.push(new Compressor.Color(data[0], data[1], data[2]));
            }

            return this.colors;
        }

        toPixelData(context, color) {
            const colorData = color.toPixelData();
            const pixel = context.createImageData(1, 1);
            for (let i = 0; i < 4; i++) {
                pixel.data[i] = colorData[i];
            }

            return pixel;
        }
    };

    compress(text) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(text);
        const length = encoded.length;
        const rest = 3 - (length % 3);
        const colors = [];
        let start = 0;

        while (start < length + 1) {
            const color = new Compressor.Color(encoded[start++] || rest || 2, encoded[start++] || rest || 2, encoded[start++] || rest || 2);

            colors.push(color);
        }

        return new Compressor.Compressed(colors);
    }

    decompressImage(img, callback) {
        const image = new Image();
        image.onload = () => {
            const decoder = new Compressor.Compressed();
            const colors = decoder.fromImage(image);
            const encoded = colors.reduce((acc, item) => {
                acc.push(item.r);
                acc.push(item.g);
                acc.push(item.b);
                return acc;
            }, []);

            const strip = encoded[encoded.length - 1];

            for (let x = 0; x < strip; x++) {
                encoded.pop();
            }

            const textDecoder = new TextDecoder();
            callback(textDecoder.decode(new Uint8Array(encoded)));
        };

        image.src = img.src;
    }
}

window.Compressor = Compressor;