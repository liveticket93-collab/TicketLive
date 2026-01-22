import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "comments.json");

// Helper to read comments
const getComments = () => {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    try {
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
};

// Helper to save comments
const saveComments = (comments: any[]) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(comments, null, 2), "utf8");
};

export async function GET() {
    try {
        const comments = getComments();
        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, content, rating, image, eventImage, verified, event } = body;

        if (!name || !content || !rating) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newComment = {
            id: Date.now().toString(),
            name,
            role: role || "Usuario",
            content,
            rating,
            image, // User avatar
            eventImage, // Event photo (Base64)
            verified: verified || false,
            event: event || "Evento General",
            createdAt: new Date().toISOString(),
        };

        const comments = getComments();
        comments.push(newComment);
        saveComments(comments);

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error saving comment:", error);
        return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
    }
}
