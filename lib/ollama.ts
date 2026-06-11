const DEFAULT_TIMEOUT_MS = 90_000;

export async function suggestTodoWithOllama(title: string): Promise<string> {
  const baseUrl =
    process.env.OLLAMA_BASE_URL ?? "https://ollama.csbihub.id";
  const model = process.env.OLLAMA_MODEL ?? "gemma4:26b";

  const prompt = `You are a productivity assistant. Given this todo title: "${title}"
Suggest 2-3 short subtasks and recommend priority (LOW, MEDIUM, or HIGH). Be concise.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ollama error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as { response?: string };
    return data.response?.trim() ?? "";
  } finally {
    clearTimeout(timeout);
  }
}

export function buildSuggestPrompt(title: string): string {
  return `Suggest subtasks for: ${title}`;
}
