import { Container } from "./Container";
import notesIcon from "../assets/notes.svg";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./Button";
import axios from "axios";
import { Input } from "./Input";
import type { Question } from "../ChapterContext";

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
      const questions = await generateQuestions();
      await axios.post(`http://localhost:3000/course/${classId}/add-chapter`, {
        title: title,
        textData: questions,
      });
      setViewForm(false);
      fetchChapters();
      setFile(null);
      setTitle("");
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const generateQuestions = async () => {
    if (!file) {
      console.error("No file submitted");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    await fetch("http://localhost:3000/gen", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error processing file:", error);
      });
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full gap-2">
      <Input
        type="string"
        placeholder="Chapter title"
        value={title}
        setter={setTitle}
      />
      <div className="flex justify-between items-center w-full h-full">
        <Container
          children={
            <>
              <div
                className="w-full h-full p-1 flex flex-col justify-center items-center gap-3 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <p className="w-96 text-center break-all h-full flex items-center justify-center">
                    Uploaded {file.name}
                  </p>
                ) : (
                  <>
                    <p className="w-96 text-center">
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
    </div>
  );
};

export { CreateChapterForm };
