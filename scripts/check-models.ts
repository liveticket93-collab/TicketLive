import fs from 'fs';
import path from 'path';

// Manual .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const dbConfig = fs.readFileSync(envPath, 'utf8');
            dbConfig.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^"(.*)"$/, '$1');
                    process.env[key] = value;
                }
            });
        }
    } catch (e) {
        console.error('Error loading .env.local:', e);
    }
}

loadEnv();

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error('Error: GOOGLE_GENERATIVE_AI_API_KEY or GOOGLE_API_KEY not found in .env.local');
    process.exit(1);
}

async function listModels() {
    console.log('Checking available models with provided API Key...');
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach((model: any) => {
                // Only show generateContent supported models
                if (model.supportedGenerationMethods?.includes('generateContent')) {
                    console.log(`- ${model.name} (${model.version})`);
                }
            });
        } else {
            console.log('No models found in response:', data);
        }
    } catch (error) {
        console.error('Failed to list models:', error);
    }
}

listModels();
