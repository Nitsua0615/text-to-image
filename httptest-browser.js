let img = new Image();
img.crossOrigin = "Anonymous";
img.src = "https://raw.githubusercontent.com/Nitsua0615/text-to-image/main/output.png";

img.onload = async () => {
    if (!window.canvas) window.canvas = document.createElement("canvas");
    if (!window.ctx) window.ctx = window.canvas.getContext("2d");
    
    ctx.drawImage(img, 0, 0);

    const filteredData = new TextDecoder("utf8").decode(Uint8Array.from(ctx.getImageData(0, 0, img.width, img.height).data.filter(b => b !== 255 && b !== 0)));

    console.log(filteredData);
};