import express, { Request, Response } from "express";
import multer from "multer";
import * as authService from "./auth";
import cors from "cors";
import { closeDb, connectDb } from "./db";

const app = express();
const port = 3000;

const startServer = async () => {
  try {
    await connectDb();

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });

    app.use(express.json());
    app.use(cors());

    const upload = multer({ dest: "./public/data/uploads/" });
    app.post("/upload", upload.single("file"), function (req, res) {
      console.log(req.file, req.body);
    });

    app.post("/register", async function register(req: Request, res: Response) {
      try {
        const { email, name, isAdmin } = req.body;
        const auth = await authService.authRegister(email, name, isAdmin);
        res.json(auth);
      } catch (err: any) {
        res.status(400).json({ error: err.message });
      }
    });

    app.post(
      "/add-course",
      async function addCourse(req: Request, res: Response) {
        try {
          const { userId, title, description } = req.body;
          const resp = await authService.addCourse(userId, title, description);
          res.json(resp);
        } catch (err: any) {
          res.status(400).json({ error: err.message });
        }
      }
    );

    app.get(
      "/user/:userId",
      async function getUser(req: Request, res: Response) {
        try {
          const userId = req.params.userId;
          const user = await authService.getUser(userId);
          res.json(user);
        } catch (err: any) {
          res.status(400).json({ error: err.message });
        }
      }
    );

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
          const courseId = req.params.userId;
          const chapters = await authService.getAllChapter(courseId);
          res.json(chapters);
        } catch (err: any) {
          res.status(400).json({ error: err.message });
        }
      }
    );
    /*
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
    */

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
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", async () => {
  console.log("Shutting down server.");
  await closeDb();
  process.exit();
});
