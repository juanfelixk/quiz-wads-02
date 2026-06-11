import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { TodoForm } from "@/components/todos/todo-form";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditTodoPage({ params }: PageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const todo = await prisma.todo.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!todo) notFound();

  return (
    <>
      <Header userName={session.user.name} />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Edit Todo</h1>
        <TodoForm
          todoId={todo.id}
          initialTitle={todo.title}
          initialDescription={todo.description ?? ""}
          initialPriority={todo.priority}
        />
      </main>
    </>
  );
}
