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
    const { name, email, password } = req.body;
    const auth = await authService.authRegister(name, email, password);
    res.json(auth);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
