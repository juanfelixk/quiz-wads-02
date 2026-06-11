import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { handleApiError, unauthorizedResponse } from "@/lib/api-error";
import { suggestTodoWithOllama } from "@/lib/ollama";

const suggestSchema = z.object({
  title: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { title } = suggestSchema.parse(body);
    const suggestion = await suggestTodoWithOllama(title);

    return NextResponse.json({
      data: {
        suggestion,
        model: process.env.OLLAMA_MODEL,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "AI request timed out. Check OLLAMA_BASE_URL and internet." },
        { status: 504 }
      );
    }
    return handleApiError(error);
  }
}
