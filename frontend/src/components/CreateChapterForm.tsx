import { Container } from "./Container";
import notesIcon from "../assets/notes.svg";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./Button";
import axios from "axios";
import { Input } from "./Input";
import { CircularProgress } from "@mui/material";

const CreateChapterForm = ({
  classId,
  setViewForm,
  fetchChapters,
}: {
  classId: string;
  setViewForm: Dispatch<SetStateAction<boolean>>;
  fetchChapters: () => Promise<void>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      // Handle file upload logic here
      setFile(f);
      console.log("File selected:", f.name);
    }
  };

  const addChapter = async () => {
    try {
      if (!title || title.trim() === "") {
        console.error("Title is required");
        return;
      }

      if (!file) {
        console.error("File is required");
        return;
      }

      setSubmitted(true);
      const questions = await generateQuestions();
      console.log(`[Frontend - addChapter] ${questions}`);
      await axios.post(`http://localhost:3000/course/${classId}/add-chapter`, {
        title: title,
        textData: questions,
      });

      setViewForm(false);
      fetchChapters();
      setFile(null);
      setTitle("");
      setSubmitted(false);
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const generateQuestions = async () => {
    if (!file) {
      console.error("No file submitted");
      return "";
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/gen", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`[Frontend - generateQuestions] ${data}`);
      return data;
    } catch (error) {
      console.error("Error processing file:", error);
      // Re-throw the error or return a specific error value
      throw error;
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full gap-2">
      {submitted ? (
        <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
          <p>Generating questions...</p>
          <CircularProgress size="3rem" color="inherit" />
        </div>
      ) : (
        <>
          <Input
            type="string"
            placeholder="Chapter title"
            value={title}
            setter={setTitle}
          />
          <div className="flex justify-between items-center w-full h-full flex-wrap gap-2">
            <Container
              children={
                <>
                  <div
                    className="w-full h-full p-1 flex flex-col justify-center items-center gap-3 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {file ? (
                      <p className="sm:w-96 text-center break-all h-full flex items-center justify-center">
                        Uploaded {file.name}
                      </p>
                    ) : (
                      <>
                        <p className="sm:w-96 text-center">
                          Upload course notes and make AI-Generated questions
                        </p>
                        <img src={notesIcon} width={45} height={45} />
                        <p>accepts .pdf, .txt</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </>
              }
            />
            <Button
              text="Submit"
              type="button"
              onClick={() => addChapter()}
              className="text-2xl"
            />
          </div>
        </>
      )}
    </div>
  );
};

export { CreateChapterForm };
