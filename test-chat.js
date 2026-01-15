// Node 18+ has built-in fetch. Using global fetch.

async function testChat() {
    console.log('🧪 Iniciando prueba de integración del Chatbot...');

    const endpoint = 'http://localhost:3005/api/chat';
    const cookieMock = 'auth_token=mock_token_for_test'; // Replace with a valid structure if needed

    const payload = {
        messages: [
            { role: 'user', content: 'Quiero agregar el evento 1 al carrito' }
        ],
        isLoggedIn: true
    };

    try {
        console.log(`📡 Enviando solicitud a ${endpoint}...`);
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieMock
            },
            body: JSON.stringify(payload)
        });

        console.log(`📥 Respuesta recibida. Status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error en la solicitud:', errorText);
            return;
        }

        // The response is a stream, but we can just print the status for now or read some text
        // In Node fetch, body is a stream.
        // For simple verification of Status 200 and no crash:
        console.log('✅ Conexión exitosa con el endpoint de chat.');
        
        // Optional: Read stream
        // const text = await response.text();
        // console.log('Response preview:', text.substring(0, 200));

    } catch (error) {
        console.error('❌ Error fatal al conectar con el servidor:', error.message);
        console.error('💡 Asegúrate de que el servidor de desarrollo esté corriendo (npm run dev).');
    }
}

testChat();
