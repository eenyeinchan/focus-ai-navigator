import { Router, type IRouter } from "express";
import { eq, sql, and, gte } from "drizzle-orm";
import { db, notesTable, tasksTable, focusSessionsTable } from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetActionPlanResponse,
  GetRecentActivityResponse,
} from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [totalNotes] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notesTable);

  const [totalTasks] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasksTable);

  const [completedTasks] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasksTable)
    .where(eq(tasksTable.status, "done"));

  const [criticalTasks] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasksTable)
    .where(and(eq(tasksTable.priority, "critical"), sql`${tasksTable.status} != 'done'`));

  const [activeSessionRow] = await db
    .select()
    .from(focusSessionsTable)
    .where(eq(focusSessionsTable.status, "active"))
    .orderBy(sql`${focusSessionsTable.createdAt} DESC`)
    .limit(1);

  const focusSessionsToday = await db
    .select()
    .from(focusSessionsTable)
    .where(
      and(
        gte(focusSessionsTable.startedAt, today),
        sql`${focusSessionsTable.status} = 'completed'`,
      ),
    );

  const focusMinutesToday = focusSessionsToday.reduce(
    (acc, s) => acc + s.durationMinutes,
    0,
  );

  const [tasksCompletedToday] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasksTable)
    .where(and(eq(tasksTable.status, "done"), gte(tasksTable.updatedAt, today)));

  const [notesThisWeek] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notesTable)
    .where(gte(notesTable.createdAt, weekAgo));

  const activeSession = activeSessionRow
    ? {
        ...activeSessionRow,
        blockedSites: (activeSessionRow.blockedSites as string[]) ?? [],
        startedAt: activeSessionRow.startedAt.toISOString(),
        endedAt: activeSessionRow.endedAt?.toISOString() ?? null,
        createdAt: activeSessionRow.createdAt.toISOString(),
      }
    : null;

  res.json(
    GetDashboardSummaryResponse.parse({
      totalNotes: Number(totalNotes.count),
      totalTasks: Number(totalTasks.count),
      completedTasks: Number(completedTasks.count),
      criticalTasks: Number(criticalTasks.count),
      activeSession,
      focusMinutesToday,
      tasksCompletedToday: Number(tasksCompletedToday.count),
      notesThisWeek: Number(notesThisWeek.count),
    }),
  );
});

router.get("/dashboard/action-plan", async (_req, res): Promise<void> => {
  const topTasks = await db
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
    .where(sql`${tasksTable.status} != 'done'`)
    .orderBy(
      sql`CASE ${tasksTable.priority}
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
        ELSE 5
      END`,
      sql`${tasksTable.createdAt} ASC`,
    )
    .limit(10);

  const recentNotes = await db
    .select({ title: notesTable.title, content: notesTable.content })
    .from(notesTable)
    .orderBy(sql`${notesTable.updatedAt} DESC`)
    .limit(3);

  let insights: string[] = [];
  let nextBestAction = "Start by reviewing your most critical tasks.";
  let suggestedFocusDuration = 25;

  if (topTasks.length > 0) {
    const taskSummary = topTasks
      .slice(0, 5)
      .map((t) => `- [${t.priority.toUpperCase()}] ${t.title}`)
      .join("\n");

    const noteSummary = recentNotes
      .map((n) => `Note: ${n.title}`)
      .join("\n");

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-5-mini",
        max_completion_tokens: 512,
        messages: [
          {
            role: "user",
            content: `You are a productivity AI. Given these tasks and notes, provide:
1. 3 brief insights about priorities and focus (each max 15 words)
2. The single best next action to take right now (max 20 words)
3. Suggested focus session duration in minutes (15, 25, 45, or 90)

Tasks:
${taskSummary}

Recent notes:
${noteSummary}

Return JSON: {"insights": ["...", "...", "..."], "nextBestAction": "...", "suggestedFocusDuration": 25}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const aiData = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
      insights = aiData.insights ?? [];
      nextBestAction = aiData.nextBestAction ?? nextBestAction;
      suggestedFocusDuration = aiData.suggestedFocusDuration ?? 25;
    } catch {
      insights = [
        `You have ${topTasks.filter((t) => t.priority === "critical").length} critical tasks pending`,
        "Focus on high-priority items first",
        "Consider blocking distractions for deep work",
      ];
    }
  }

  const formattedTasks = topTasks.map((t) => ({
    ...t,
    description: t.description ?? null,
    dueDate: t.dueDate?.toISOString() ?? null,
    noteId: t.noteId ?? null,
    noteTitle: t.noteTitle ?? null,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  res.json(
    GetActionPlanResponse.parse({
      generatedAt: new Date().toISOString(),
      topPriorities: formattedTasks,
      insights,
      suggestedFocusDuration,
      nextBestAction,
    }),
  );
});

router.get("/dashboard/activity", async (_req, res): Promise<void> => {
  const recentNotes = await db
    .select()
    .from(notesTable)
    .orderBy(sql`${notesTable.updatedAt} DESC`)
    .limit(5);

  const recentTasks = await db
    .select({
      id: tasksTable.id,
      title: tasksTable.title,
      status: tasksTable.status,
      aiGenerated: tasksTable.aiGenerated,
      createdAt: tasksTable.createdAt,
      updatedAt: tasksTable.updatedAt,
    })
    .from(tasksTable)
    .orderBy(sql`${tasksTable.updatedAt} DESC`)
    .limit(5);

  const recentSessions = await db
    .select()
    .from(focusSessionsTable)
    .orderBy(sql`${focusSessionsTable.createdAt} DESC`)
    .limit(3);

  const activities: Array<{
    id: string;
    type: string;
    title: string;
    description: string | null;
    timestamp: string;
  }> = [];

  for (const note of recentNotes) {
    activities.push({
      id: `note-created-${note.id}`,
      type: "note_created",
      title: `Note created: ${note.title}`,
      description: `Type: ${note.type}`,
      timestamp: note.createdAt.toISOString(),
    });
    if (note.analyzedAt) {
      activities.push({
        id: `note-analyzed-${note.id}`,
        type: "note_analyzed",
        title: `AI analyzed: ${note.title}`,
        description: "Tasks and insights extracted",
        timestamp: note.analyzedAt.toISOString(),
      });
    }
  }

  for (const task of recentTasks) {
    if (task.status === "done") {
      activities.push({
        id: `task-completed-${task.id}`,
        type: "task_completed",
        title: `Task completed: ${task.title}`,
        description: null,
        timestamp: task.updatedAt.toISOString(),
      });
    } else if (task.aiGenerated) {
      activities.push({
        id: `task-created-${task.id}`,
        type: "task_created",
        title: `AI task created: ${task.title}`,
        description: "Extracted from note analysis",
        timestamp: task.createdAt.toISOString(),
      });
    } else {
      activities.push({
        id: `task-created-${task.id}`,
        type: "task_created",
        title: `Task created: ${task.title}`,
        description: null,
        timestamp: task.createdAt.toISOString(),
      });
    }
  }

  for (const session of recentSessions) {
    if (session.status === "completed") {
      activities.push({
        id: `focus-completed-${session.id}`,
        type: "focus_completed",
        title: `Focus session completed`,
        description: `${session.durationMinutes} min — ${session.goal}`,
        timestamp: (session.endedAt ?? session.createdAt).toISOString(),
      });
    } else if (session.status === "active") {
      activities.push({
        id: `focus-started-${session.id}`,
        type: "focus_started",
        title: `Focus session started`,
        description: `${session.durationMinutes} min — ${session.goal}`,
        timestamp: session.startedAt.toISOString(),
      });
    }
  }

  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  res.json(GetRecentActivityResponse.parse(activities.slice(0, 15)));
});

export default router;
