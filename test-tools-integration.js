
const API_URL = "http://localhost:3000";

async function runTest() {
    console.log("=== INICIO DE TEST DE INTEGRACIÓN ===");

    try {
        // 1. Obtener eventos para tener un ID real
        console.log("\n1. Buscando eventos...");
        const eventsRes = await fetch(`${API_URL}/events`);
        const events = await eventsRes.json();
        
        if (!events || events.length === 0) {
            console.error("❌ No se encontraron eventos. Asegúrate de que el backend tenga datos.");
            return;
        }

        const targetEvent = events[0]; // Usaremos el primer evento
        console.log(`✅ Evento encontrado: "${targetEvent.title}" (ID: ${targetEvent.id})`);

        // Simulamos un ID que podría ser number o string, pero la DB usa UUID (string)
        const eventId = targetEvent.id;

        // 2. Agregar al carrito
        console.log(`\n2. Intentando agregar al carrito (Event ID: ${eventId})...`);
        const addToCartRes = await fetch(`${API_URL}/cart/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId: eventId, quantity: 1 })
        });

        const addToCartData = await addToCartRes.json();
        console.log("Response AddToCart:", JSON.stringify(addToCartData, null, 2));

        if (!addToCartRes.ok) {
            console.error("❌ Falló agregar al carrito");
            // No detenemos, intentamos seguir para ver qué pasa
        } else {
            console.log("✅ Agregado correctamente");
        }

        // 3. Ver Carrito
        console.log("\n3. Obteniendo carrito...");
        const cartRes = await fetch(`${API_URL}/cart`);
        const cart = await cartRes.json();
        console.log("Cart Items:", JSON.stringify(cart.items, null, 2));

        // Buscar el item que acabamos de agregar para obtener su ID de item de carrito
        // Nota: El backend elimina por cartItemId, no por eventId directamente
        const start = performance.now();
        const cartItem = cart.items?.find(item => item.eventId === eventId || item.event?.id === eventId);
        
        if (!cartItem) {
            console.error("❌ El item no aparece en el carrito");
        } else {
            console.log(`✅ Item encontrado en carrito. CartItemID: ${cartItem.id}`);

            // 4. Eliminar del carrito
            console.log(`\n4. Eliminando del carrito (CartItem ID: ${cartItem.id})...`);
            const deleteRes = await fetch(`${API_URL}/cart/items/${cartItem.id}`, {
                method: 'DELETE'
            });
            
            if (deleteRes.ok) {
                console.log("✅ Eliminado correctamente");
            } else {
                console.error("❌ Falló eliminar del carrito:", await deleteRes.text());
            }
        }

    } catch (error) {
        console.error("\n❌ ERROR CRÍTICO EN EL TEST:", error);
    }
}

runTest();
