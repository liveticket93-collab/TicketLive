
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
require('dotenv').config({ path: '.env.local' });

async function main() {
  try {
    console.log('Testing Google Gemini connection...');
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: 'Hola, di "Conexión exitosa" si puedes leerme.',
    });
    console.log('Response:', result.text);
  } catch (error) {
    console.error('Error testing Google Gemini:', error);
  }
}

main();
