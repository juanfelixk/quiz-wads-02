import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { TodoDeleteButton } from "@/components/todos/todo-delete-button";

export default async function TodosPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login?callbackUrl=/todos");
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header userName={session.user.name} />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Todos</h1>
          <Link href="/todos/new">
            <Button>New Todo</Button>
          </Link>
        </div>
        {todos.length === 0 ? (
          <p className="text-muted-foreground">No todos yet.</p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-start justify-between rounded-lg border p-4">
                <div>
                  <h2 className="font-semibold">{todo.title}</h2>
                  {todo.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{todo.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {todo.priority} · {todo.completed ? "Done" : "Open"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/todos/${todo.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <TodoDeleteButton todoId={todo.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
