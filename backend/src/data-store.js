import { promises as fs } from "fs";
import { existsSync } from "fs";
import path from "path";

const nowIso = () => new Date().toISOString();

const COLLECTIONS = {
  projects: {
    path: "content/projects.json",
    template: () => ({ updatedAt: nowIso(), items: [] })
  },
  services: {
    path: "content/services.json",
    template: () => ({ updatedAt: nowIso(), items: [] })
  },
  knowledge: {
    path: "content/knowledge.json",
    template: () => ({ updatedAt: nowIso(), items: [] })
  },
  changelog: {
    path: "content/changelog.json",
    template: () => ({ updatedAt: nowIso(), items: [] })
  },
  feedback: {
    path: "feedback/feedback.json",
    template: () => ({ updatedAt: nowIso(), items: [] })
  }
};

const AUDIT_LOG_PATH = "audit/audit-log.jsonl";
const I18N_DIR = "i18n";

export const resolveDataDir = () => {
  const candidates = [
    process.env.DATA_DIR,
    path.resolve(process.cwd(), "data"),
    path.resolve(process.cwd(), "../data"),
    path.resolve(process.cwd(), "../../data")
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
};

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const writeJsonAtomic = async (filePath, data) => {
  const tempPath = `${filePath}.${process.pid}.tmp`;
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(tempPath, payload, "utf8");
  await fs.rename(tempPath, filePath);
};

export const ensureDataStore = async (dataDir) => {
  await ensureDir(dataDir);
  for (const collection of Object.values(COLLECTIONS)) {
    const fullPath = path.join(dataDir, collection.path);
    await ensureDir(path.dirname(fullPath));
    if (!existsSync(fullPath)) {
      await writeJsonAtomic(fullPath, collection.template());
    }
  }
  const auditPath = path.join(dataDir, AUDIT_LOG_PATH);
  await ensureDir(path.dirname(auditPath));
  if (!existsSync(auditPath)) {
    await fs.writeFile(auditPath, "", "utf8");
  }
  await ensureDir(path.join(dataDir, I18N_DIR));
};

export const getCollectionPath = (dataDir, name) => {
  const config = COLLECTIONS[name];
  if (!config) {
    throw new Error(`Unknown collection: ${name}`);
  }
  return path.join(dataDir, config.path);
};

export const readCollection = async (dataDir, name) => {
  const filePath = getCollectionPath(dataDir, name);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
};

export const writeCollection = async (dataDir, name, data) => {
  const filePath = getCollectionPath(dataDir, name);
  await writeJsonAtomic(filePath, data);
};

export const appendAuditLog = async (dataDir, event) => {
  const auditPath = path.join(dataDir, AUDIT_LOG_PATH);
  const payload = `${JSON.stringify({ ...event, at: nowIso() })}\n`;
  await fs.appendFile(auditPath, payload, "utf8");
};

export const listCollections = () => Object.keys(COLLECTIONS);

export const getAuditLogPath = (dataDir) => path.join(dataDir, AUDIT_LOG_PATH);
