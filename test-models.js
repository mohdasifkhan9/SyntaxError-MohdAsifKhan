const fetch = require('node-fetch');

async function run() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const fetchFn = typeof global.fetch !== "undefined" ? global.fetch : require('node-fetch');
        const res = await fetchFn(url);
        const data = await res.json();
        const models = data.models ? data.models.map(m => m.name) : data;
        console.log("AVAILABLE MODELS:", models);
    } catch(e) {
        console.error("error:", e);
    }
}
run();
