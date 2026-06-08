import type { VercelRequest, VercelResponse } from '@vercel/node';

const APP_NAME = "Mirror Feed Orchestrator MCP";
const APP_VERSION = "1.0.0";

const TOOLS = [
  {
    name: "get_race_status",
    description: "Get the current status of the race",
    inputSchema: { type: "object", properties: {}, required: [] }
  },
  {
    name: "start_race",
    description: "Start a new trace in the feed",
    inputSchema: { type: "object", properties: {}, required: [] }
  },
  {
    name: "get_leaderboard",
    description: "Get the current leaderboard rankings",
    inputSchema: { type: "object", properties: {}, required: [] }
  },
  {
    name: "optimize_speed",
    description: "Optimizes speed parameters for the entity",
    inputSchema: { type: "object", properties: {}, required: [] }
  },
  {
    name: "get_track_info",
    description: "Provides information about the mirrored track",
    inputSchema: { type: "object", properties: {}, required: [] }
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      protocol: "MCP",
      version: APP_VERSION,
      name: APP_NAME,
      status: "active",
      description: "Active MCP server for Mirror Feed Orchestrator Agent",
      capabilities: ["feed-mirroring", "content-aggregation", "real-time-distribution"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const method = body.method;
      const id = body.id;

      const respond = (result: any) => {
        if (id !== undefined || body.jsonrpc) {
          return res.status(200).json({
            jsonrpc: "2.0",
            id: id,
            result: result
          });
        }
        return res.status(200).json(result);
      };

      if (method === "initialize") {
        return respond({
          protocolVersion: "2024-11-05",
          serverInfo: { name: APP_NAME, version: APP_VERSION },
          capabilities: { tools: {}, prompts: {}, resources: {} }
        });
      }

      if (method === "tools/list") {
        return respond({ tools: TOOLS });
      }

      if (method === "tools/call") {
        const toolName = body.params?.name;
        return respond({
          content: [{ type: "text", text: `Executed ${toolName} successfully.` }]
        });
      }

      if (method === "prompts/list") {
        return respond({ prompts: [] });
      }

      if (method === "resources/list") {
        return respond({ resources: [] });
      }

      return res.status(200).json({
        status: "success",
        message: "MCP command received",
        agent: "Mirror Feed Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
