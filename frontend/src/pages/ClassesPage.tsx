import { useState } from "react";
import { Button } from "../components/Button";
import { ClassCard } from "../components/ClassCard";
import { useNavigate } from "react-router-dom";
import CreateClassForm from "../components/CreateClassForm";

export type ClassData = {
  _id: string;
  title: string;
  description: string;
  chapters: string[];
};

const ClassPage = () => {
  const [data, setData] = useState<ClassData[]>([]);
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
        <CreateClassForm setData={setData} setShowForm={setShowForm} />
      ) : (
        <div className="container flex flex-1 gap-4 overflow-auto w-140 flex-col sm:flex-row">
          {data.map((item) => (
            <ClassCard
              key={item._id}
              title={item.title}
              description={item.description}
              chapters={item.chapters.length}
              onClick={() => navigate(`${url}/${item._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassPage;
