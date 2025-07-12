import { useState } from "react";
import { Button } from "../components/Button";
import { ClassCard } from "../components/ClassCard";
import { useNavigate } from "react-router-dom";
import CreateClassForm from "../components/CreateClassForm";

type ClassData = {
  _id: string;
  title: string;
  description: string;
  chapters: number;
};

const ClassPage = () => {
  const [data, setData] = useState<ClassData[]>([
    {
      _id: "1",
      title: "COMP6080",
      description:
        "Learn the basics of React, a popular JavaScript library for building user interfaces.",
      chapters: 5,
    },
    {
      _id: "2",
      title: "COMP6081",
      description:
        "Explore advanced patterns and techniques in React development.",
      chapters: 8,
    },
    {
      _id: "3",
      title: "COMP6082",
      description:
        "Understand how to manage state in large applications using Redux.",
      chapters: 6,
    },
    {
      _id: "4",
      title: "COMP6082",
      description:
        "Understand how to manage state in large applications using Redux.",
      chapters: 6,
    },
    {
      _id: "5",
      title: "COMP6082",
      description:
        "Understand how to manage state in large applications using Redux.",
      chapters: 6,
    },
  ]);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const url = window.location.pathname;

  return (
    <div className="flex flex-col items-center gap-4 justify-between h-full">
      <div className="flex items-center text-3xl font-bold mb-4 gap-4 justify-between w-full">
        <Button text="+" onClick={() => setShowForm(!showForm)} />
        <p>My Classes</p>
      </div>
      {showForm ? (
        <CreateClassForm />
      ) : (
        <div className="container flex flex-1 gap-4 overflow-auto w-140 flex-col sm:flex-row">
          {data.map((item) => (
            <ClassCard
              key={item._id}
              title={item.title}
              description={item.description}
              chapters={item.chapters}
              onClick={() => navigate(`${url}/${item._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassPage;
