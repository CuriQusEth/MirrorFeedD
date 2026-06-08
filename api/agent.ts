import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      name: "Mirror Feed Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Mirror Feed",
      version: "1.0.0"
    });
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      return res.status(200).json({
        status: "success",
        message: "Agent endpoint received POST",
        agent: "Mirror Feed Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid agent request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
