import fs from 'fs';
import path from 'path';

try {
    const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
    for (const line of envContent.split('\n')) {
        if (line.startsWith('GEMINI_API_KEY=')) {
            let keyParams = line.split('=')[1].trim();
            if (keyParams.startsWith('"') && keyParams.endsWith('"')) {
                 keyParams = keyParams.substring(1, keyParams.length - 1);
            }
            process.env.GEMINI_API_KEY = keyParams;
            break;
        }
    }
} catch(e) {}

import { analyzeDocument } from './lib/gemini';

async function test() {
    try {
        const text = "This is a simple employment contract. The employee agrees to work for $1000 a week. There is a penalty of $50,000 if they quit within a year.";
        console.log("Input text:", text);
        console.log("Analyzing...");
        const result = await analyzeDocument(text);
        console.log("SUCCESS! Gemini returned valid JSON:");
        console.log(JSON.stringify(result, null, 2));
    } catch(e) {
        console.error("Test Failed:", e);
    }
}
test();
