import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import pdf from "pdf-parse";

import * as authService from "./auth";
import { closeDb, connectDb } from "./db";
import { generateQuestions } from "./question";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/register", async function register(req: Request, res: Response) {
  try {
    const { email, name, isAdmin } = req.body;
    const auth = await authService.authRegister(email, name, isAdmin);
    res.json(auth);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/user/:userId", async function getUser(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const user = await authService.getUser(userId);
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
      const exists = await authService.checkEmailExists(email);
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
      const courses = await authService.getAllCourses(userId);
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
      // FIX: Changed req.params.userId to req.params.courseId
      const courseId = req.params.courseId;
      const chapters = await authService.getAllChapter(courseId);
      res.json(chapters);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

app.post(
  "/course/add-chapter/:courseId",
  async function addChapter(req: Request, res: Response) {
    try {
      const { title } = req.body;
      const courseId = req.params.courseId;
      const questions = [
        {
          questionText: "aa",
          options: ["a", "b"],
          correctAnswer: "a",
        },
      ];
      const auth = await authService.addChapter(courseId, title, questions);
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
    const questions = await generateQuestions(textData, 8);
    res.json(questions);
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
      const resp = await authService.enrollClass(userId, courseId);
      res.json(resp);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

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

process.on("SIGINT", async () => {
  console.log("Shutting down server.");
  await closeDb();
  process.exit(0);
});

startServer();
