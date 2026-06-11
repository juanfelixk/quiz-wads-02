import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  handleApiError,
  notFoundResponse,
  unauthorizedResponse,
} from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { updateTodoSchema } from "@/lib/validators/todo";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const todo = await prisma.todo.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!todo) {
      return notFoundResponse("Todo not found");
    }

    return NextResponse.json({ data: todo });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    /** EXAM Q3: missing session and ownership check — anyone can update any todo */
    const existing = await prisma.todo.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("Todo not found");
    }

    const body = await _request.json();
    const input = updateTodoSchema.parse(body);

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...input,
        dueDate:
          input.dueDate === undefined
            ? undefined
            : input.dueDate
              ? new Date(input.dueDate)
              : null,
      },
    });

    return NextResponse.json({ data: todo });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user) {
      return unauthorizedResponse();
    }

    const existing = await prisma.todo.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return notFoundResponse("Todo not found");
    }
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ message: "Todo deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
