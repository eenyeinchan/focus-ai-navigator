import { Router, type IRouter } from "express";
import { eq, ilike, sql } from "drizzle-orm";
import { db, notesTable, tasksTable } from "@workspace/db";
import {
  ListNotesQueryParams,
  ListNotesResponse,
  CreateNoteBody,
  GetNoteParams,
  GetNoteResponse,
  UpdateNoteParams,
  UpdateNoteBody,
  UpdateNoteResponse,
  DeleteNoteParams,
  AnalyzeNoteParams,
  AnalyzeNoteResponse,
} from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

router.get("/notes", async (req, res): Promise<void> => {
  const params = ListNotesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { search, tag } = params.data;

  const allNotes = await db.select().from(notesTable).orderBy(sql`${notesTable.updatedAt} DESC`);

  let filtered = allNotes;

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(lower) ||
        n.content.toLowerCase().includes(lower),
    );
  }

  if (tag) {
    filtered = filtered.filter((n) => (n.tags as string[]).includes(tag));
  }

  const notesWithTaskCount = await Promise.all(
    filtered.map(async (note) => {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(tasksTable)
        .where(eq(tasksTable.noteId, note.id));
      return {
        ...note,
        tags: (note.tags as string[]) ?? [],
        taskCount: Number(count),
        analyzedAt: note.analyzedAt?.toISOString() ?? null,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      };
    }),
  );

  res.json(ListNotesResponse.parse(notesWithTaskCount));
});

router.post("/notes", async (req, res): Promise<void> => {
  const parsed = CreateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [note] = await db
    .insert(notesTable)
    .values({
      title: parsed.data.title,
      content: parsed.data.content,
      type: parsed.data.type,
      tags: parsed.data.tags ?? [],
    })
    .returning();

  res.status(201).json(
    GetNoteResponse.parse({
      ...note,
      tags: (note.tags as string[]) ?? [],
      taskCount: 0,
      analyzedAt: note.analyzedAt?.toISOString() ?? null,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    }),
  );
});

router.get("/notes/:id", async (req, res): Promise<void> => {
  const params = GetNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [note] = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.id, params.data.id));

  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasksTable)
    .where(eq(tasksTable.noteId, note.id));

  res.json(
    GetNoteResponse.parse({
      ...note,
      tags: (note.tags as string[]) ?? [],
      taskCount: Number(count),
      analyzedAt: note.analyzedAt?.toISOString() ?? null,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    }),
  );
});

router.put("/notes/:id", async (req, res): Promise<void> => {
  const params = UpdateNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.content !== undefined) updateData.content = parsed.data.content;
  if (parsed.data.type !== undefined) updateData.type = parsed.data.type;
  if (parsed.data.tags !== undefined) updateData.tags = parsed.data.tags;

  const [note] = await db
    .update(notesTable)
    .set(updateData)
    .where(eq(notesTable.id, params.data.id))
    .returning();

  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasksTable)
    .where(eq(tasksTable.noteId, note.id));

  res.json(
    UpdateNoteResponse.parse({
      ...note,
      tags: (note.tags as string[]) ?? [],
      taskCount: Number(count),
      analyzedAt: note.analyzedAt?.toISOString() ?? null,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    }),
  );
});

router.delete("/notes/:id", async (req, res): Promise<void> => {
  const params = DeleteNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [note] = await db
    .delete(notesTable)
    .where(eq(notesTable.id, params.data.id))
    .returning();

  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/notes/:id/analyze", async (req, res): Promise<void> => {
  const params = AnalyzeNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [note] = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.id, params.data.id));

  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  const prompt = `You are an AI productivity assistant. Analyze the following note and extract actionable insights.

Note Title: ${note.title}
Note Type: ${note.type}
Note Content:
${note.content}

Return a JSON response with exactly this structure:
{
  "summary": "2-3 sentence summary of the note",
  "extractedTasks": [
    {
      "title": "task title",
      "description": "optional description",
      "priority": "critical|high|medium|low",
      "dueDate": "ISO 8601 date or null"
    }
  ],
  "keyInsights": ["insight 1", "insight 2"],
  "suggestedNextActions": ["action 1", "action 2"]
}

Be specific and actionable. Extract real tasks from the content. Priority should reflect urgency and importance. Return only valid JSON.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  let parsed: {
    summary?: string;
    extractedTasks?: Array<{
      title: string;
      description?: string;
      priority?: string;
      dueDate?: string | null;
    }>;
    keyInsights?: string[];
    suggestedNextActions?: string[];
  } = {};

  try {
    parsed = JSON.parse(content);
  } catch {
    req.log.error({ content }, "Failed to parse AI response");
  }

  const validPriorities = ["critical", "high", "medium", "low"] as const;

  const insertedTasks = await Promise.all(
    (parsed.extractedTasks ?? []).map(async (t) => {
      const priority = validPriorities.includes(t.priority as (typeof validPriorities)[number])
        ? (t.priority as (typeof validPriorities)[number])
        : "medium";

      const [task] = await db
        .insert(tasksTable)
        .values({
          title: t.title,
          description: t.description ?? null,
          priority,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          noteId: note.id,
          aiGenerated: true,
          status: "todo",
        })
        .returning();

      return task;
    }),
  );

  await db
    .update(notesTable)
    .set({ analyzedAt: new Date() })
    .where(eq(notesTable.id, note.id));

  const formattedTasks = insertedTasks.map((t) => ({
    ...t,
    description: t.description ?? null,
    dueDate: t.dueDate?.toISOString() ?? null,
    noteId: t.noteId ?? null,
    noteTitle: note.title,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  res.json(
    AnalyzeNoteResponse.parse({
      noteId: note.id,
      summary: parsed.summary ?? "Analysis complete.",
      extractedTasks: formattedTasks,
      keyInsights: parsed.keyInsights ?? [],
      suggestedNextActions: parsed.suggestedNextActions ?? [],
    }),
  );
});

export default router;
