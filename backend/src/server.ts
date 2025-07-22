import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import pdf from "pdf-parse";

import * as service from "./service";
import { closeDb, connectDb } from "./db";
import { generateQuestions } from "./question";
import { generateWavAudio } from "./audio";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/register", async function register(req: Request, res: Response) {
  try {
    const { email, name, isAdmin } = req.body;
    const auth = await service.authRegister(email, name, isAdmin);
    res.json(auth);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/user/:userId", async function getUser(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const user = await service.getUser(userId);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get(
  "/user/email/:email",
  async function getUserByEmail(req: Request, res: Response) {
    try {
      const email = req.params.email;
      const exists = await service.checkEmailExists(email);
      res.json(exists);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.get(
  "/user/:userId/courses/",
  async function getCoursesByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const courses = await service.getAllCourses(userId);
      res.json(courses);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.get(
  "/course/:courseId/chapters/",
  async function getChaptersByCourse(req: Request, res: Response) {
    try {
      const courseId = req.params.courseId;
      const chapters = await service.getAllChapter(courseId);
      res.json(chapters);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.post("/add-course", async function addCourse(req: Request, res: Response) {
  try {
    const { userId, title, description } = req.body;
    const resp = await service.addCourse(userId, title, description);
    res.json(resp);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get(
  "/chapter/:chapterId",
  async function getChapterById(req: Request, res: Response) {
    try {
      const courseId = req.params.chapterId;
      const chapter = await service.getChapter(courseId);
      res.json(chapter);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.post(
  "/course/:courseId/add-chapter",
  async function addChapter(req: Request, res: Response) {
    try {
      const { title, textData } = req.body;
      const courseId = req.params.courseId;
      const questions = await generateQuestions(textData, 8);
      const auth = await service.addChapter(courseId, title, questions);
      res.json(auth);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

// POST /gen
app.post("/gen", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    let textData: string;
    if (req.file.mimetype === "application/pdf") {
      const pdfData = await pdf(req.file.buffer);
      textData = pdfData.text;
    } else if (req.file.mimetype === "text/plain") {
      textData = req.file.buffer.toString("utf8");
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }
    if (!textData) {
      return res.status(400).json({ error: "Could not extract text." });
    }
    // const questions = await generateQuestions(textData, 8);
    // res.json(questions);
    console.log(`[Backend - /gen] ${textData}`);
    res.json(textData);
  } catch (err: any) {
    console.error("Error processing file:", err);
    res.status(500).json({ error: `Failed to process file: ${err.message}` });
  }
});

app.put(
  "/user/:userId/courses",
  async function enrollClass(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const { courseId } = req.body;
      const resp = await service.enrollClass(userId, courseId);
      res.json(resp);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.put("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { data } = req.body;
    const updatedData = await service.updateUser(userId, data);
    res.json(updatedData);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

const startServer = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

// audio usage
// curl -X POST http://localhost:3000/gen-speech \
// -H "Content-Type: application/json" \
// -d '{"text": "Joe: Hows it going today Jane?"}' \
// -o output.wav

app.post("/gen-speech", async (req: Request, res: Response) => {
  const tempFilePath = path.join(os.tmpdir(), `temp_audio_${Date.now()}.wav`);

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        success: false,
        error: "Request body must contain 'text'.",
      });
    }

    const wavBuffer = await generateWavAudio(text);
    console.log(
      `[Server] Generated WAV buffer of size: ${wavBuffer.length} bytes.`
    );

    if (!wavBuffer || wavBuffer.length === 0) {
      throw new Error("Generated WAV buffer is empty or invalid.");
    }

    await fs.writeFile(tempFilePath, wavBuffer);
    console.log(`[Server] Temporarily saved WAV file to: ${tempFilePath}`);

    res.sendFile(tempFilePath, (err) => {
      if (err) {
        console.error("[Server] Error sending file:", err);
      } else {
        console.log("[Server] Successfully sent file to client.");
      }

      fs.unlink(tempFilePath).catch((unlinkErr) => {
        console.error("[Server] Error deleting temporary file:", unlinkErr);
      });
    });
  } catch (err: any) {
    console.error(
      "[Server] An error occurred during the speech generation pipeline:",
      err.message
    );

    fs.access(tempFilePath)
      .then(() => fs.unlink(tempFilePath))
      .catch(() => {});
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Failed to generate audio.",
        details: err.message,
      });
    }
  }
});

process.on("SIGINT", async () => {
  console.log("Shutting down server.");
  await closeDb();
  process.exit(0);
});

startServer();
