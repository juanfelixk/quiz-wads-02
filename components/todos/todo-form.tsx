"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type TodoFormProps = {
  initialTitle?: string;
  initialDescription?: string;
  initialPriority?: "LOW" | "MEDIUM" | "HIGH";
  todoId?: string;
};

export function TodoForm({
  initialTitle = "",
  initialDescription = "",
  initialPriority = "MEDIUM",
  todoId,
}: TodoFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState(initialPriority);
  const [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  async function handleAiSuggest() {
    if (!title.trim()) {
      setError("Enter a title before AI suggest.");
      return;
    }
    setAiLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "AI failed");
      setSuggestion(json.data.suggestion);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI failed");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = todoId ? `/api/todos/${todoId}` : "/api/todos";
      const method = todoId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      router.push("/todos");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="min-h-[100px] w-full rounded-md border px-3 py-2 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
          }
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : todoId ? "Update" : "Create Todo"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={aiLoading}
          onClick={handleAiSuggest}
        >
          {aiLoading ? "Thinking..." : "AI Suggest"}
        </Button>
      </div>
      {suggestion && (
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <p className="font-medium">AI Suggestion</p>
          <p className="whitespace-pre-wrap">{suggestion}</p>
        </div>
      )}
    </form>
  );
}
