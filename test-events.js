
const start = async () => {
    try {
        const response = await fetch('http://localhost:3000/events');
        const data = await response.json();
        console.log("Raw Events Data:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error fetching events:", e.message);
    }
};
start();
