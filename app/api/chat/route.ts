import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs";

const openAiConfiguration = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const POST = async (req: Request) => {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;


        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
        if (!openAiConfiguration.apiKey) return new NextResponse("OpenAI API Key not configured.", { status: 500 });
        if (!messages) return new NextResponse("Messages are required", { status: 400 });


        const completion = await openAiConfiguration.chat.completions.create({
            messages,
            model: "gpt-3.5-turbo",
        });

        return NextResponse.json(completion.choices[0].message);
    } catch {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};