import express, { Request, Response } from 'express';
import { promises } from 'fs';
import multer from 'multer';
import pdf from 'pdf-parse';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({});

const app = express();
app.use(express.json());
const port = 3000;

const upload = multer({ dest: './public/data/uploads/' })
app.post('/upload', upload.single('file'), async function (req, res) {
    if (!req.file || !req.file.path) {
        return res.status(400).send('No file');
    }
    console.log(req.file, req.body)

    let textData;
    try {
        if (req.file.mimetype === "text/plain") {
            textData = await promises.readFile(req.file.path, 'utf8');
        } else if (req.file.mimetype === "application/pdf") {
            const buffer = await promises.readFile(req.file.path);
            const pdfData = await pdf(buffer);
            textData = pdfData.text;
        } else {
            return res.status(400).send('Invalid filetype');
        }
    } catch (err) {
        return res.status(400).send('File read error');
    }

    console.log(textData);
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "create several multiple choice questions from this content:" + textData,
        });
        res.send(response.text);
    } catch (err) {
        console.log(err);
        return res.status(400).send('ai fail');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
