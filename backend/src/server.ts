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
      console.log(`Example app listening on port ${port}`);
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
