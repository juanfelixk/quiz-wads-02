import { createTodoSchema } from "@/lib/validators/todo";

describe("createTodoSchema", () => {
  it("rejects empty title", () => {
    const result = createTodoSchema.safeParse({ title: "" });
    // EXAM Q3: currently passes — add .min(1)
    expect(result.success).toBe(false);
  });
});
