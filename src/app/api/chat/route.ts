import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        console.log('Starting streamText with Groq...');
        const result = await streamText({
            model: groq('llama-3.3-70b-versatile'),
            messages,
        });

        console.log('Result type:', typeof result);
        console.log('Result keys:', Object.keys(result));

        if (typeof (result as any).toDataStreamResponse === 'function') {
            return (result as any).toDataStreamResponse();
        }

        if (typeof (result as any).toTextStreamResponse === 'function') {
            return (result as any).toTextStreamResponse();
        }

        if (typeof (result as any).toAIStreamResponse === 'function') {
            return (result as any).toAIStreamResponse();
        }

        throw new Error(`toDataStreamResponse is not a function. Available keys: ${Object.keys(result).join(', ')}`);
    } catch (error) {
        console.error('Error in chat route:', error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
