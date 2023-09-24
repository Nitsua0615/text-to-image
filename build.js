Bun.build({
    entrypoints: ['./httptest.js'],
    outdir: './build',
    minify: false,
    target: "browser"
    // additional config
});