const { GoogleGenerativeAI } = require('@google/generative-ai');
// dotenv removed
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const res = await model.generateContent("hello");
        console.log("flash-latest worked!");
    } catch(e) { console.error("flash-latest error:", e.message); }
    try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res2 = await model2.generateContent("hello");
        console.log("flash worked!");
    } catch(e) { console.error("flash error:", e.message); }
}
run();
