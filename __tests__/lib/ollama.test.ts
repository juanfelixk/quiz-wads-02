import { buildSuggestPrompt } from "@/lib/ollama";

describe("buildSuggestPrompt", () => {
  it("includes the todo title in the prompt", () => {
    const prompt = buildSuggestPrompt("Prepare WADS quiz section 02");
    expect(prompt).toContain("Prepare WADS quiz section 02");
  });

  it("uses HTTPS base URL from environment", () => {
    const base = process.env.OLLAMA_BASE_URL ?? "";
    expect(base.startsWith("https://")).toBe(true);
  });

  it("uses the correct Ollama model name", () => {
    // EXAM Q4: fails when OLLAMA_MODEL is gemma2:27b — correct is gemma4:26b
    expect(process.env.OLLAMA_MODEL).toBe("gemma4:26b");
  });
});
