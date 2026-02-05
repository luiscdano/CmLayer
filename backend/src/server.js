import Fastify from "fastify";
import cors from "@fastify/cors";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import {
  appendAuditLog,
  ensureDataStore,
  getAuditLogPath,
  readCollection,
  resolveDataDir,
  writeCollection
} from "./data-store.js";
import {
  ChangelogEntryInputSchema,
  FeedbackInputSchema,
  FeedbackStatus,
  FeedbackUpdateSchema
} from "./schemas.js";

const nowIso = () => new Date().toISOString();
const todayDate = () => new Date().toISOString().slice(0, 10);

const parseCorsOrigin = () => {
  const raw = process.env.CORS_ORIGIN;
  if (!raw || raw.trim() === "*") {
    return true;
  }
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const buildHealth = () => ({
  ok: true,
  timestamp: nowIso(),
  uptimeSeconds: Math.round(process.uptime())
});

const normalizeCollection = (data) => {
  if (!data || typeof data !== "object") {
    return { updatedAt: nowIso(), items: [] };
  }
  if (!Array.isArray(data.items)) {
    return { ...data, items: [] };
  }
  return data;
};

const selectLatestRelease = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  const withTime = items
    .map((entry) => {
      const timestamp = Date.parse(entry.date || entry.createdAt || "");
      return { entry, timestamp };
    })
    .filter((item) => !Number.isNaN(item.timestamp));

  if (withTime.length === 0) {
    return null;
  }

  withTime.sort((a, b) => b.timestamp - a.timestamp);
  const latest = withTime[0].entry;
  return latest;
};

const ensureAdmin = (request, reply) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    reply.code(500).send({ error: "ADMIN_TOKEN not configured" });
    return false;
  }
  const header = request.headers["x-admin-token"];
  const provided = Array.isArray(header) ? header[0] : header;
  if (!provided || provided !== token) {
    reply.code(401).send({ error: "Unauthorized" });
    return false;
  }
  return true;
};

export const buildServer = async () => {
  const app = Fastify({ logger: true });

  const dataDir = resolveDataDir();
  if (!dataDir) {
    throw new Error("DATA_DIR not found. Set DATA_DIR or ensure ./data exists.");
  }
  await ensureDataStore(dataDir);

  await app.register(cors, { origin: parseCorsOrigin() });

  app.get("/api/health", async () => buildHealth());

  app.get("/api/status", async () => {
    const changelog = normalizeCollection(await readCollection(dataDir, "changelog"));
    return {
      health: buildHealth(),
      latestRelease: selectLatestRelease(changelog.items)
    };
  });

  app.get("/api/projects", async () =>
    normalizeCollection(await readCollection(dataDir, "projects"))
  );

  app.get("/api/services", async () =>
    normalizeCollection(await readCollection(dataDir, "services"))
  );

  app.get("/api/knowledge", async () =>
    normalizeCollection(await readCollection(dataDir, "knowledge"))
  );

  app.get("/api/changelog", async () =>
    normalizeCollection(await readCollection(dataDir, "changelog"))
  );

  app.get("/api/voices", async () => {
    const feedbackData = normalizeCollection(
      await readCollection(dataDir, "feedback")
    );
    const items = feedbackData.items
      .filter((item) => item.status === "Published" && item.consent)
      .map((item) => ({
        id: item.id,
        name: item.name || "Anonymous",
        message: item.message,
        context: item.context || null,
        type: item.type || null,
        topic: item.topic || null,
        source: item.source || null,
        publishedAt: item.publishedAt || item.updatedAt || item.createdAt
      }));

    return {
      updatedAt: feedbackData.updatedAt,
      total: items.length,
      items
    };
  });

  app.get("/api/i18n/:lang", async (request, reply) => {
    const lang = request.params?.lang;
    if (!lang || !["en", "es"].includes(lang)) {
      reply.code(404).send({ error: "Language not found" });
      return;
    }

    try {
      const filePath = path.join(dataDir, "i18n", `${lang}.json`);
      const raw = await fs.readFile(filePath, "utf8");
      reply.send(JSON.parse(raw));
    } catch (error) {
      reply.code(404).send({ error: "Language not found" });
    }
  });

  app.post("/api/feedback", async (request, reply) => {
    const parsed = FeedbackInputSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400).send({ error: "Invalid payload", details: parsed.error.flatten() });
      return;
    }

    const input = parsed.data;
    if (!input.consent) {
      reply.code(400).send({ error: "Consent is required" });
      return;
    }

    const feedbackData = normalizeCollection(
      await readCollection(dataDir, "feedback")
    );

    const now = nowIso();
    const entry = {
      id: randomUUID(),
      status: "Pending",
      name: input.name || "Anonymous",
      email: input.email || null,
      type: input.type || null,
      topic: input.topic || null,
      context: input.context || null,
      budget: input.budget || null,
      timeline: input.timeline || null,
      message: input.message,
      consent: input.consent,
      source: input.source || null,
      createdAt: now,
      updatedAt: now,
      notes: []
    };

    feedbackData.items.push(entry);
    feedbackData.updatedAt = now;

    await writeCollection(dataDir, "feedback", feedbackData);
    await appendAuditLog(dataDir, {
      action: "feedback.created",
      feedbackId: entry.id,
      status: entry.status,
      hasEmail: Boolean(entry.email)
    });

    reply.code(201).send({ id: entry.id, status: entry.status });
  });

  app.get("/admin/feedback", async (request, reply) => {
    if (!ensureAdmin(request, reply)) {
      return;
    }

    const status = request.query?.status;
    if (status && !FeedbackStatus.safeParse(status).success) {
      reply.code(400).send({ error: "Invalid status filter" });
      return;
    }

    const feedbackData = normalizeCollection(
      await readCollection(dataDir, "feedback")
    );
    const items = status
      ? feedbackData.items.filter((item) => item.status === status)
      : feedbackData.items;

    reply.send({
      updatedAt: feedbackData.updatedAt,
      total: items.length,
      items
    });
  });

  app.patch("/admin/feedback/:id", async (request, reply) => {
    if (!ensureAdmin(request, reply)) {
      return;
    }

    const parsed = FeedbackUpdateSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      reply.code(400).send({ error: "Invalid payload", details: parsed.error.flatten() });
      return;
    }

    const { status, note } = parsed.data;
    if (!status && !note) {
      reply.code(400).send({ error: "Nothing to update" });
      return;
    }

    const feedbackData = normalizeCollection(
      await readCollection(dataDir, "feedback")
    );
    const entry = feedbackData.items.find((item) => item.id === request.params.id);

    if (!entry) {
      reply.code(404).send({ error: "Feedback not found" });
      return;
    }

    const previousStatus = entry.status;
    const now = nowIso();

    if (status) {
      entry.status = status;
      entry.updatedAt = now;
      if (status === "Approved") {
        entry.approvedAt = now;
      }
      if (status === "Published") {
        entry.publishedAt = now;
      }
    }

    if (note) {
      if (!Array.isArray(entry.notes)) {
        entry.notes = [];
      }
      entry.notes.push({ note, at: now });
      entry.updatedAt = now;
    }

    feedbackData.updatedAt = now;
    await writeCollection(dataDir, "feedback", feedbackData);

    await appendAuditLog(dataDir, {
      action: "feedback.updated",
      feedbackId: entry.id,
      from: previousStatus,
      to: entry.status,
      noted: Boolean(note)
    });

    reply.send({ id: entry.id, status: entry.status, updatedAt: entry.updatedAt });
  });

  app.post("/admin/changelog", async (request, reply) => {
    if (!ensureAdmin(request, reply)) {
      return;
    }

    const parsed = ChangelogEntryInputSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.code(400).send({ error: "Invalid payload", details: parsed.error.flatten() });
      return;
    }

    const input = parsed.data;
    const now = nowIso();
    const entry = {
      id: randomUUID(),
      title: input.title,
      summary: input.summary,
      date: input.date || todayDate(),
      tags: input.tags || [],
      links: input.links || [],
      createdAt: now,
      updatedAt: now
    };

    const changelog = normalizeCollection(
      await readCollection(dataDir, "changelog")
    );
    changelog.items.unshift(entry);
    changelog.updatedAt = now;

    await writeCollection(dataDir, "changelog", changelog);
    await appendAuditLog(dataDir, {
      action: "changelog.created",
      changelogId: entry.id,
      date: entry.date
    });

    reply.code(201).send(entry);
  });

  app.get("/admin/audit", async (request, reply) => {
    if (!ensureAdmin(request, reply)) {
      return;
    }

    const limitRaw = request.query?.limit;
    const limit = Number.isFinite(Number(limitRaw)) ? Number(limitRaw) : 100;
    const boundedLimit = Math.max(1, Math.min(limit, 500));

    const auditPath = getAuditLogPath(dataDir);
    const raw = await fs.readFile(auditPath, "utf8");
    const lines = raw.split("\n").filter(Boolean);
    const sliced = lines.slice(-boundedLimit).map((line) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        return { error: "Invalid audit entry", raw: line };
      }
    });

    reply.send({
      total: lines.length,
      limit: boundedLimit,
      items: sliced
    });
  });

  return app;
};
