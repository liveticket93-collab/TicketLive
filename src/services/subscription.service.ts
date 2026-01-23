import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'subscribers.json');

export interface ISubscriber {
    email: string;
    subscribedAt: string;
}

const ensureDb = async () => {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }

    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, JSON.stringify([]));
    }
};

export const subscribe = async (email: string): Promise<void> => {
    await ensureDb();
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const subscribers: ISubscriber[] = JSON.parse(data);

    if (subscribers.some(s => s.email === email)) {
        // Ya está suscrito, no hacemos nada o tiramos error si preferimos
        return;
    }

    subscribers.push({
        email,
        subscribedAt: new Date().toISOString(),
    });

    await fs.writeFile(DB_FILE, JSON.stringify(subscribers, null, 2));
};

export const getSubscribers = async (): Promise<string[]> => {
    await ensureDb();
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const subscribers: ISubscriber[] = JSON.parse(data);
    return subscribers.map(s => s.email);
};
