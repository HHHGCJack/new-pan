import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

async function startServer() {
  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/proxy-pdf", async (req, res) => {
    let url = req.query.url as string;
    if (!url) return res.status(400).send("Missing url parameter");
    
    // Handle relative URLs by prepending the server's origin
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://127.0.0.1:${PORT}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('pdf') && !contentType.includes('octet-stream')) {
        const text = await response.text();
        console.error(`Proxy fetched non-PDF content (${contentType}):`, text.substring(0, 200));
        return res.status(400).send(`URL did not return a PDF. Content-Type: ${contentType}`);
      }
      
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(Buffer.from(buffer));
    } catch (error) {
      console.error("Proxy PDF error:", error);
      res.status(500).send("Failed to proxy PDF");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in development
    app.use(async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      
      // Only handle GET requests that accept HTML
      if (req.method !== 'GET' || !req.headers.accept?.includes('text/html')) {
        return next();
      }

      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static("dist"));
    app.use((req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
