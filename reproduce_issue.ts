
import { subscribe } from './src/services/subscription.service';

async function test() {
    try {
        console.log("Attempting to subscribe...");
        await subscribe('test_repro@example.com');
        console.log("Subscription successful");
    } catch (error) {
        console.error("Subscription failed:", error);
    }
}

test();
