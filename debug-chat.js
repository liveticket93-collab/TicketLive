const { groq } = require('@ai-sdk/groq');
const { streamText } = require('ai');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function main() {
  try {
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages: [{ role: 'user', content: 'Hola' }],
    });

    console.log('Streaming started...');
    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }
    console.log('\nStreaming finished.');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
