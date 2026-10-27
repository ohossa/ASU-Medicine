import { recordPresence, getOnlineUsers } from "../server/presence-service.js";

interface Request {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface Response {
  setHeader(name: string, value: string): void;
  status(code: number): Response;
  json(value: unknown): unknown;
}

export default async function handler(req: Request, res: Response) {
  res.setHeader("Cache-Control", "no-store, private");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "POST") {
    let body: any = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const userId = body?.userId || "anonymous";
    const alias = body?.alias;
    const moduleCode = body?.moduleCode;

    const onlineCount = await recordPresence({ userId, alias, moduleCode });
    return res.status(200).json({ ok: true, onlineCount });
  }

  if (req.method === "GET") {
    const data = await getOnlineUsers();
    return res.status(200).json(data);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed. Use GET or POST." });
}
