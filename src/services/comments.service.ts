export interface Comment {
    id?: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    image: string;
    eventImage?: string;
    verified?: boolean;
    event?: string;
    createdAt?: string;
}

export const getComments = async (): Promise<Comment[]> => {
    const response = await fetch("/api/comments");
    if (!response.ok) {
        throw new Error("Failed to fetch comments");
    }
    return response.json();
};

export const createComment = async (comment: Comment): Promise<Comment> => {
    const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
    });

    if (!response.ok) {
        throw new Error("Failed to create comment");
    }
    return response.json();
};
