import { useEffect, useState } from "react";
import { Input } from "./Input";
import type { Question } from "../ChapterContext";
import { Button } from "./Button";
import checkIcon from "../assets/check.png";
import axios from "axios";

const EditComponent = ({
  setQuestions,
  question,
  index,
}: {
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  question: Question;
  index: number;
}) => {
  const [title, setTitle] = useState(question.questionText);
  const [option1, setOption1] = useState(question.options[0]);
  const [option2, setOption2] = useState(question.options[1]);
  const [option3, setOption3] = useState(question.options[2]);
  const [option4, setOption4] = useState(question.options[3]);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer);

  useEffect(() => {
    const updatedQuestions: Question = {
      questionText: title,
      options: [option1, option2, option3, option4],
      correctAnswer: correctAnswer,
    };

    setQuestions((prevQuestions: Question[]) => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = updatedQuestions;
      return newQuestions;
    });
  }, [title, option1, option2, option3, option4, correctAnswer]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 w-full sm:w-140 border-1 rounded-lg">
      <div className="flex flex-col gap-2">
        <p className="font-bold">Question {index + 1}</p>
        <Input
          placeholder="Question"
          value={title}
          setter={setTitle}
          className="w-full mb-4"
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Option 1"
            value={option1}
            setter={setOption1}
            className="w-full mb-4"
          />
          <Button
            icon={
              <img src={checkIcon} alt="Check" className="h-[1.8rem] w-full" />
            }
            text=""
            type="button"
            onClick={() => setCorrectAnswer(0)}
            className={`place-self-start p-2 h-full text-xl border-2 border-black rounded-lg ${
              correctAnswer === 0
                ? "bg-green-200 hover:bg-green-200"
                : "bg-white hover:bg-gray-200"
            }`}
          />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Option 2"
            value={option2}
            setter={setOption2}
            className="w-full mb-4"
          />
          <Button
            icon={
              <img src={checkIcon} alt="Check" className="h-[1.8rem] w-full" />
            }
            text=""
            type="button"
            onClick={() => setCorrectAnswer(1)}
            className={`place-self-start p-2 h-full text-xl border-2 border-black rounded-lg ${
              correctAnswer === 1
                ? "bg-green-200 hover:bg-green-200"
                : "bg-white hover:bg-gray-200"
            }`}
          />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Option 3"
            value={option3}
            setter={setOption3}
            className="w-full mb-4"
          />
          <Button
            icon={
              <img src={checkIcon} alt="Check" className="h-[1.8rem] w-full" />
            }
            text=""
            type="button"
            onClick={() => setCorrectAnswer(2)}
            className={`place-self-start p-2 h-full text-xl border-2 border-black rounded-lg ${
              correctAnswer === 2
                ? "bg-green-200 hover:bg-green-200"
                : "bg-white hover:bg-gray-200"
            }`}
          />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Option 4"
            value={option4}
            setter={setOption4}
            className="w-full mb-4"
          />
          <Button
            icon={
              <img src={checkIcon} alt="Check" className="h-[1.8rem] w-full" />
            }
            text=""
            type="button"
            onClick={() => setCorrectAnswer(3)}
            className={`place-self-start p-2 h-full text-xl border-2 border-black rounded-lg ${
              correctAnswer === 3
                ? "bg-green-200 hover:bg-green-200"
                : "bg-white hover:bg-gray-200"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export { EditComponent };
