import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const QR_STORAGE_FILE = path.join(process.cwd(), "public", "support-qr.jpg");

async function startServer() {
  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get uploaded support QR code
  app.get("/api/support-qr", (req, res) => {
    if (fs.existsSync(QR_STORAGE_FILE)) {
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.sendFile(QR_STORAGE_FILE);
    }
    res.status(404).send("Not found");
  });

  // Upload exact original support QR code
  app.post("/api/support-qr", (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64" });
      }
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      
      // Ensure public dir exists
      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(QR_STORAGE_FILE, buffer);

      // Also update src/assets/support_qr_base64.ts for bundled fallback
      const assetsDir = path.join(process.cwd(), "src", "assets");
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(assetsDir, "support_qr_base64.ts"),
        `export const SUPPORT_QR_IMGDB = "https://pic1.imgdb.cn/i/034BLlXycinjzppzDQlRoC.jpg";\n` +
        `export const SUPPORT_QR_FREEIMAGE = "https://iili.io/CZNy2mF.jpg";\n` +
        `export const SUPPORT_QR_LOCAL = "/support-qr.jpg";\n` +
        `export const SUPPORT_QR_API = "/api/support-qr";\n` +
        `export const SUPPORT_QR_BASE64 = "data:image/jpeg;base64,${base64Data}";\n` +
        `export const SUPPORT_QR_SOURCES = [\n` +
        `  "/support-qr.jpg",\n` +
        `  "https://pic1.imgdb.cn/i/034BLlXycinjzppzDQlRoC.jpg",\n` +
        `  "https://iili.io/CZNy2mF.jpg",\n` +
        `  "/api/support-qr",\n` +
        `  "data:image/jpeg;base64,${base64Data}"\n` +
        `];\n` +
        `export const DEFAULT_SUPPORT_QR = "/support-qr.jpg";\n`
      );

      res.json({ success: true, url: "/support-qr.jpg?t=" + Date.now() });
    } catch (err: any) {
      console.error("Save QR error:", err);
      res.status(500).json({ error: err.message });
    }
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
