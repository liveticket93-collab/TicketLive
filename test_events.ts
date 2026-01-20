
import { getEvents, getEventCategories } from './src/services/events.service';
import 'dotenv/config'; // Requires npm install dotenv

async function test() {
    console.log('Testing events service...');
    try {
        const events = await getEvents();
        console.log('Events:', events.length);
        const categories = await getEventCategories();
        console.log('Categories:', categories.length);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
