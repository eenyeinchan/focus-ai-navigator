import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, tasksTable, notesTable } from "@workspace/db";
import {
  ListTasksQueryParams,
  ListTasksResponse,
  CreateTaskBody,
  UpdateTaskParams,
  UpdateTaskBody,
  UpdateTaskResponse,
  DeleteTaskParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tasks", async (req, res): Promise<void> => {
  const params = ListTasksQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { status, priority, noteId } = params.data;

  const tasks = await db
    .select({
      id: tasksTable.id,
      title: tasksTable.title,
      description: tasksTable.description,
      status: tasksTable.status,
      priority: tasksTable.priority,
      dueDate: tasksTable.dueDate,
      noteId: tasksTable.noteId,
      aiGenerated: tasksTable.aiGenerated,
      createdAt: tasksTable.createdAt,
      updatedAt: tasksTable.updatedAt,
      noteTitle: notesTable.title,
    })
    .from(tasksTable)
    .leftJoin(notesTable, eq(tasksTable.noteId, notesTable.id))
    .orderBy(
      sql`CASE ${tasksTable.priority}
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
        ELSE 5
      END`,
      sql`${tasksTable.createdAt} DESC`,
    );

  let filtered = tasks;
  if (status) filtered = filtered.filter((t) => t.status === status);
  if (priority) filtered = filtered.filter((t) => t.priority === priority);
  if (noteId) filtered = filtered.filter((t) => t.noteId === noteId);

  const formatted = filtered.map((t) => ({
    ...t,
    description: t.description ?? null,
    dueDate: t.dueDate?.toISOString() ?? null,
    noteId: t.noteId ?? null,
    noteTitle: t.noteTitle ?? null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  res.json(ListTasksResponse.parse(formatted));
});

router.post("/tasks", async (req, res): Promise<void> => {
  const parsed = CreateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [task] = await db
    .insert(tasksTable)
    .values({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      priority: parsed.data.priority,
      status: parsed.data.status ?? "todo",
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      noteId: parsed.data.noteId ?? null,
      aiGenerated: false,
    })
    .returning();

  let noteTitle: string | null = null;
  if (task.noteId) {
    const [note] = await db
      .select({ title: notesTable.title })
      .from(notesTable)
      .where(eq(notesTable.id, task.noteId));
    noteTitle = note?.title ?? null;
  }

  res.status(201).json({
    ...task,
    description: task.description ?? null,
    dueDate: task.dueDate?.toISOString() ?? null,
    noteId: task.noteId ?? null,
    noteTitle,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  });
});

router.put("/tasks/:id", async (req, res): Promise<void> => {
  const params = UpdateTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.priority !== undefined) updateData.priority = parsed.data.priority;
  if ("dueDate" in parsed.data) {
    updateData.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate as string) : null;
  }

  const [task] = await db
    .update(tasksTable)
    .set(updateData)
    .where(eq(tasksTable.id, params.data.id))
    .returning();

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  let noteTitle: string | null = null;
  if (task.noteId) {
    const [note] = await db
      .select({ title: notesTable.title })
      .from(notesTable)
      .where(eq(notesTable.id, task.noteId));
    noteTitle = note?.title ?? null;
  }

  res.json(
    UpdateTaskResponse.parse({
      ...task,
      description: task.description ?? null,
      dueDate: task.dueDate?.toISOString() ?? null,
      noteId: task.noteId ?? null,
      noteTitle,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }),
  );
});

router.delete("/tasks/:id", async (req, res): Promise<void> => {
  const params = DeleteTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [task] = await db
    .delete(tasksTable)
    .where(eq(tasksTable.id, params.data.id))
    .returning();

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
