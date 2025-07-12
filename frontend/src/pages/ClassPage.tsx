import { useState } from "react";
import { Button } from "../components/Button";
import { ChapterCard } from "../components/ChapterCard";

const ClassPage = () => {
  const [chapters, setChapters] = useState([
    "Chapter 1: Introduction of Mathematics",
    "Chapter 2: Algebra Basics",
    "Chapter 3: Geometry Fundamentals",
    "Chapter 4: Calculus Concepts",
  ]);

  return (
    <div className="flex flex-col items-center justify-between h-full gap-4">
      <div className="flex items-center text-3xl font-bold mb-4 gap-4 justify-between w-full">
        <Button text="+" onClick={() => {}} />
        <p>MATH1231</p>
      </div>
      <div className="container flex flex-col gap-4 overflow-auto w-140">
        {chapters.map((chapter, index) => (
          <ChapterCard key={index} title={chapter} onClick={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default ClassPage;
