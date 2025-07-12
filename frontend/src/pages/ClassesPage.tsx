import { useState } from "react";
import { Button } from "../components/Button";
import { ClassCard } from "../components/ClassCard";

type ClassData = {
  title: string;
  description: string;
  chapters: number;
};

const ClassPage = () => {
  const [data, setData] = useState<ClassData[]>([
    {
      title: "COMP6080",
      description:
        "Learn the basics of React, a popular JavaScript library for building user interfaces.",
      chapters: 5,
    },
    {
      title: "COMP6081",
      description:
        "Explore advanced patterns and techniques in React development.",
      chapters: 8,
    },
    {
      title: "COMP6082",
      description:
        "Understand how to manage state in large applications using Redux.",
      chapters: 6,
    },
    {
      title: "COMP6082",
      description:
        "Understand how to manage state in large applications using Redux.",
      chapters: 6,
    },
    {
      title: "COMP6082",
      description:
        "Understand how to manage state in large applications using Redux.",
      chapters: 6,
    },
  ]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-5">
      <div className="flex items-center text-3xl font-bold mb-4 gap-4 justify-between w-full">
        <Button text="+" onClick={() => {}} />
        <p>My Classes</p>
      </div>
      <div className="flex gap-4 overflow-auto w-140 flex-col sm:flex-row">
        {data.map((item) => (
          <ClassCard
            key={item.title}
            title={item.title}
            description={item.description}
            chapters={item.chapters}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default ClassPage;
