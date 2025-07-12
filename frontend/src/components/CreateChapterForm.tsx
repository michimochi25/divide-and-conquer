import { Container } from "./Container";
import notesIcon from "../assets/notes.svg";
import { useRef, useState } from "react";
import { Button } from "./Button";

const CreateChapterForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      // Handle file upload logic here
      setFile(f);
      console.log("File selected:", f.name);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    let resData = null;
    formData.append("file", file);
    fetch("http://localhost:3000/gen", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("File processed successfully:", data);
        resData = data;
      })
      .catch((error) => {
        console.error("Error processing file:", error);
      });

    
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full">
      <Container
        children={
          <>
            <div
              className="w-full h-full p-1 flex flex-col justify-center items-center gap-3 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="w-94 text-center">
                Upload course notes and make AI-Generated questions
              </p>
              <img src={notesIcon} width={45} height={45} />
              <p>accepts .pdf, .txt</p>
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
      <Button text="Submit" type="button" onClick={() => handleFileUpload()} />
    </div>
  );
};

export { CreateChapterForm };
