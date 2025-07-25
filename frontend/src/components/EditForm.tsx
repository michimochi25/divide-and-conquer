import { useEffect, useState } from "react";
import type { Question } from "../ChapterContext";
import { EditComponent } from "./EditComponent";
import axios from "axios";
import { Button } from "./Button";
import { Input } from "./Input";
import { useErrorContext } from "../ErrorContext";

const EditForm = ({
  chapterId,
  close,
}: {
  chapterId: string | null;
  close: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const { setErrorMsg } = useErrorContext();

  const getChapter = async () => {
    if (!chapterId) {
      return;
    }

    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/chapter/${chapterId}`
      );
      setQuestions(resp.data.chapter.question);
      setTitle(resp.data.chapter.title);
    } catch (error) {
      setErrorMsg("Error fetching chapter");
    }
  };

  const updateChapter = async () => {
    try {
      const resp = await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/chapter/${chapterId}`,
        { title: title, questions: questions }
      );
      console.log("Chapter saved successfully:", resp.data);
      close();
    } catch (error) {
      setErrorMsg("Error saving chapter");
    }
  };

  const cancelUpdate = () => {
    close();
    getChapter();
  };

  useEffect(() => {
    getChapter();
  }, [chapterId]);

  return (
    <form className="flex flex-col items-center gap-4 w-auto h-100 max-h-full p-5 border-1 rounded-lg bg-white">
      <div className="flex gap-2 w-full justify-between items-center">
        <Button
          text="Save"
          onClick={updateChapter}
          type="button"
          className="text-xl hover:bg-gray-300"
        />
        <Button
          text="Close"
          onClick={() => cancelUpdate()}
          type="button"
          className="text-xl hover:bg-gray-300"
        />
      </div>
      <div className="container flex flex-col gap-4 w-full max-w-2xl overflow-y-scroll">
        <div className="flex flex-col gap-2 p-3 border-1 rounded-lg">
          <p className="font-bold">Chapter Title</p>
          <Input
            placeholder="Chapter Title"
            value={title}
            setter={setTitle}
            className="w-full mb-4"
          />
        </div>
        {questions.map((data, index) => {
          return (
            <EditComponent
              key={index}
              index={index}
              question={data}
              setQuestions={setQuestions}
            />
          );
        })}
      </div>
    </form>
  );
};

export { EditForm };
