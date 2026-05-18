import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS middleware for APIs
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });

  // API - Agent
  const agentGetHandler = (req: express.Request, res: express.Response) => {
    res.json({
      name: "Mirror Feed Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Mirror Feed",
      version: "1.0.0"
    });
  };

  const agentPostHandler = (req: express.Request, res: express.Response) => {
    try {
      const body = req.body;
      res.json({
        status: "success",
        message: "Agent endpoint received POST",
        agent: "Mirror Feed Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid agent request" });
    }
  };

  app.get("/api/agent", agentGetHandler);
  app.get("/app/api/agent", agentGetHandler);
  app.post("/api/agent", agentPostHandler);
  app.post("/app/api/agent", agentPostHandler);

  // API - MCP
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

  const mcpGetHandler = (req: express.Request, res: express.Response) => {
    res.json({
      protocol: "MCP",
      version: APP_VERSION,
      name: APP_NAME,
      status: "active",
      description: "Active MCP server for Mirror Feed Orchestrator Agent",
      capabilities: ["feed-mirroring", "content-aggregation", "real-time-distribution"],
      timestamp: new Date().toISOString()
    });
  };

  const mcpPostHandler = (req: express.Request, res: express.Response) => {
    try {
      const body = req.body || {};
      const method = body.method;
      const id = body.id;

      const respond = (result: any) => {
        if (id !== undefined || body.jsonrpc) {
          return res.json({
            jsonrpc: "2.0",
            id: id,
            result: result
          });
        }
        return res.json(result);
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

      return res.json({
        status: "success",
        message: "MCP command received",
        agent: "Mirror Feed Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  };

  app.get("/api/mcp", mcpGetHandler);
  app.get("/app/api/mcp", mcpGetHandler);
  app.post("/api/mcp", mcpPostHandler);
  app.post("/app/api/mcp", mcpPostHandler);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
