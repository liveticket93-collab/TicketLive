import { NextResponse } from "next/server";
import { sendWeeklyNewsletter } from "@/lib/newsletter";

export const maxDuration = 60;

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const result = await sendWeeklyNewsletter();

        if (!result.success) {
            return NextResponse.json({ message: result.message }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            message: `Newsletter sent to ${result.recipientCount} subscribers`
        });

    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
