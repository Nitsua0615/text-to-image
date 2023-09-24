const res = await fetch("https://raw.githubusercontent.com/Nitsua0615/text-to-image/main/test.png");
const arb = await res.arrayBuffer();

console.log(arb);