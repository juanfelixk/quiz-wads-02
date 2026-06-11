import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <>
      <Header userName={session?.user.name} />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold">Todo List — WADS Quiz</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Manage todos with PostgreSQL, Better Auth, Firebase Google login, REST
          API, Docker, and remote Ollama AI.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {session?.user ? (
            <Link href="/todos">
              <Button>My Todos</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button>Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </>
          )}
          <Link href="/api/docs">
            <Button variant="secondary">API Docs</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
