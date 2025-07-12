import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ClassCard } from "../components/ClassCard";
import { useNavigate } from "react-router-dom";
import CreateClassForm from "../components/CreateClassForm";
import axios from "axios";
import { useAuth } from "../AuthContext";

type ClassData = {
  _id: string;
  title: string;
  description: string;
  chapters: string[];
};

const ClassPage = () => {
  const [data, setData] = useState<ClassData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { userData } = useAuth();

  const navigate = useNavigate();
  const url = window.location.pathname;

  const updateData = async () => {
    // Fetch the classes for the user
    try {
      const response = await axios.get(
        `http://localhost:3000/user/${userData?._id}/courses`
      );

      if (response.data && Array.isArray(response.data.courses)) {
        setData(response.data.courses);
      } else {
        console.error("Unexpected data format:", response.data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    updateData();
  }, [userData]);

  return (
    <div className="flex flex-col items-center gap-4 justify-between h-full">
      <div className="flex items-center text-3xl font-bold mb-4 gap-4 justify-between w-full">
        <Button text="+" onClick={() => setShowForm(!showForm)} />
        <p>My Classes</p>
      </div>
      {showForm ? (
        <CreateClassForm
          setShowForm={setShowForm}
          updateData={updateData}
          isAdmin={userData?.isAdmin || false}
        />
      ) : (
        <div className="container flex flex-1 gap-4 overflow-auto w-140 flex-col sm:flex-row">
          {data.map((item, index) => (
            <ClassCard
              key={item._id}
              title={item.title}
              description={item.description}
              chapters={item.chapters?.length ?? 0}
              onClick={() =>
                navigate(`${url}/${item._id}`, { state: { data: data[index] } })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassPage;
