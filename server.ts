import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Setup uploads directory
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files
app.use("/uploads", express.static(UPLOADS_DIR));

// Simple JSON DB for books
const DB_FILE = path.join(process.cwd(), "books.json");
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

const getBooks = () => JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
const saveBooks = (books: any) => fs.writeFileSync(DB_FILE, JSON.stringify(books, null, 2));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// API Routes
app.get("/api/books", (req, res) => {
  res.json(getBooks());
});

app.post("/api/books", upload.fields([{ name: "cover", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverFile = files["cover"]?.[0];
    const pdfFile = files["pdf"]?.[0];
    const { title, description, password } = req.body;

    if (password !== "Gc200902") {
      return res.status(401).json({ error: "Unauthorized: Incorrect password" });
    }

    if (!coverFile || !pdfFile || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBook = {
      id: Date.now().toString(),
      title,
      description: description || "",
      coverUrl: `/uploads/${coverFile.filename}`,
      pdfUrl: `/uploads/${pdfFile.filename}`,
      createdAt: new Date().toISOString(),
    };

    const books = getBooks();
    books.push(newBook);
    saveBooks(books);

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error uploading book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in development
    app.use('*', async (req, res, next) => {
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
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
