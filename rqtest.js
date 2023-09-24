const res = await fetch("https://3000-nitsua0615-textimage-v455gz11ywu.ws-us104.gitpod.io/test.png");
const arb = await res.arrayBuffer();

console.log(arb);