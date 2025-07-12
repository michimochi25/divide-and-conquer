import express, { Request, Response } from 'express';
import multer  from 'multer';
const app = express();
app.use(express.json());
const port = 3000;

const upload = multer({ dest: './public/data/uploads/' })
app.post('/upload', upload.single('file'), function (req, res) {
  console.log(req.file, req.body)
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
