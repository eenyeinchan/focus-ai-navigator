import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, focusSessionsTable, blockedSitesTable } from "@workspace/db";
import {
  ListFocusSessionsResponse,
  CreateFocusSessionBody,
  UpdateFocusSessionParams,
  UpdateFocusSessionBody,
  UpdateFocusSessionResponse,
  ListBlockedSitesResponse,
  CreateBlockedSiteBody,
  DeleteBlockedSiteParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/focus-sessions", async (_req, res): Promise<void> => {
  const sessions = await db
    .select()
    .from(focusSessionsTable)
    .orderBy(sql`${focusSessionsTable.createdAt} DESC`);

  const formatted = sessions.map((s) => ({
    ...s,
    blockedSites: (s.blockedSites as string[]) ?? [],
    startedAt: s.startedAt.toISOString(),
    endedAt: s.endedAt?.toISOString() ?? null,
    createdAt: s.createdAt.toISOString(),
  }));

  res.json(ListFocusSessionsResponse.parse(formatted));
});

router.post("/focus-sessions", async (req, res): Promise<void> => {
  const parsed = CreateFocusSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [session] = await db
    .insert(focusSessionsTable)
    .values({
      goal: parsed.data.goal,
      durationMinutes: parsed.data.durationMinutes,
      blockedSites: parsed.data.blockedSites ?? [],
      status: "active",
      startedAt: new Date(),
    })
    .returning();

  res.status(201).json({
    ...session,
    blockedSites: (session.blockedSites as string[]) ?? [],
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString() ?? null,
    createdAt: session.createdAt.toISOString(),
  });
});

router.put("/focus-sessions/:id", async (req, res): Promise<void> => {
  const params = UpdateFocusSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateFocusSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.endedAt !== undefined) updateData.endedAt = new Date(parsed.data.endedAt);

  const [session] = await db
    .update(focusSessionsTable)
    .set(updateData)
    .where(eq(focusSessionsTable.id, params.data.id))
    .returning();

  if (!session) {
    res.status(404).json({ error: "Focus session not found" });
    return;
  }

  res.json(
    UpdateFocusSessionResponse.parse({
      ...session,
      blockedSites: (session.blockedSites as string[]) ?? [],
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt?.toISOString() ?? null,
      createdAt: session.createdAt.toISOString(),
    }),
  );
});

router.get("/blocked-sites", async (_req, res): Promise<void> => {
  const sites = await db
    .select()
    .from(blockedSitesTable)
    .orderBy(sql`${blockedSitesTable.createdAt} DESC`);

  const formatted = sites.map((s) => ({
    ...s,
    label: s.label ?? null,
    createdAt: s.createdAt.toISOString(),
  }));

  res.json(ListBlockedSitesResponse.parse(formatted));
});

router.post("/blocked-sites", async (req, res): Promise<void> => {
  const parsed = CreateBlockedSiteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [site] = await db
    .insert(blockedSitesTable)
    .values({
      pattern: parsed.data.pattern,
      label: parsed.data.label ?? null,
    })
    .returning();

  res.status(201).json({
    ...site,
    label: site.label ?? null,
    createdAt: site.createdAt.toISOString(),
  });
});

router.delete("/blocked-sites/:id", async (req, res): Promise<void> => {
  const params = DeleteBlockedSiteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [site] = await db
    .delete(blockedSitesTable)
    .where(eq(blockedSitesTable.id, params.data.id))
    .returning();

  if (!site) {
    res.status(404).json({ error: "Blocked site not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
