const res = await fetch("https://raw.githubusercontent.com/Nitsua0615/text-to-image/main/test.png");
const arb = await res.arrayBuffer();

console.log(arb);

const buf = Buffer.from(arb);

let out = "";
for (let index = 0; index < arb.byteLength; index++) {
    out += String.fromCharCode(buf.readUInt8(index));
}
console.log(out);