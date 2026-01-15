
const start = async () => {
    const endpoint = 'http://localhost:3005/api/chat';
    
    // Helper to run a test case
    const runTest = async (message) => {
        console.log(`\n\n🧪 Testing message: "${message}"`);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: message }],
                    isLoggedIn: true
                })
            });

            if (!response.ok) {
                console.error(`Status ${response.status}`);
                console.error(await response.text());
                return;
            }

            // Read the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                console.log('📦 Chunk:', chunk.trim());
            }
        } catch (e) {
            console.error("Error:", e.message);
        }
    };

    await runTest("hola");
    await runTest("buscar concierto");
    await runTest("quiero agregar al carrito");
};

start();
