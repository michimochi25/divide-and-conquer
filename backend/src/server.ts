import express, { Request, Response } from "express";
import * as authService from "./auth";
import multer from "multer";
import pdf from "pdf-parse";
import { generateQuestions } from "./question";

const app = express();
app.use(express.json());
const port = 3000;

app.post("/register", async function register(req: Request, res: Response) {
  try {
    const { name, email, isAdmin } = req.body;
    const auth = await authService.authRegister(name, email, isAdmin);
    res.json(auth);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/add-chapter/:courseId", async function addCourse(req: Request, res: Response) {
  try {
    const { title } = req.body;
    const courseId = req.params.courseId;
    const question = [
      {
        questionText: "which one is better?",
        options: ["apple", "banana", "exam", "holiday"],
        correctAnswer: "exam",
      },
    ];

    const auth = await authService.addChapter(courseId, title, question);
    res.json(auth);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/gen", upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    let textData: string;
    if (req.file.mimetype === "application/pdf") {
      const pdfData = await pdf(req.file.buffer);
      textData = pdfData.text;
    } else if (req.file.mimetype === "text/plain") {
      textData = req.file.buffer.toString('utf8');
    } else {
      return res.status(400).json({ error: "Unsupported file type. Please upload a .pdf or .txt file." });
    }

    if (!textData) {
      return res.status(400).json({ error: "Could not extract text from the file." });
    }

    const questions = await generateQuestions(textData, 8);

    res.json(questions);
  } catch (err: any) {
    console.error("Error processing file:", err);
    res.status(500).json({ error: `Failed to process file: ${err.message}` });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
