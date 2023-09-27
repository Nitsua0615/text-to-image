let img = new Image();
img.crossOrigin = "Anonymous";
img.src = "https://cdn.discordapp.com/attachments/1094063758411829310/1156348525228069004/X4o0PtF.png";

img.onload = () => {
    window.canvas = window.canvas || document.createElement("canvas");
    window.ctx = window.ctx || window.canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const filteredData = new TextDecoder("utf8").decode(Uint8Array.from(ctx.getImageData(0, 0, img.width, img.height).data.filter(b => b !== 255 && b !== 0)));

    console.log(filteredData);
};