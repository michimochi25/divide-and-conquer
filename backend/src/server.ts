import express, { Request, Response } from "express";
import multer from "multer";
import * as authService from "./auth";

const app = express();
app.use(express.json());
const port = 3000;

const upload = multer({ dest: "./public/data/uploads/" });
app.post("/upload", upload.single("file"), function (req, res) {
  console.log(req.file, req.body);
});

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
