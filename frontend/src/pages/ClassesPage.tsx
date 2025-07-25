import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ClassCard } from "../components/ClassCard";
import { useNavigate } from "react-router-dom";
import CreateClassForm from "../components/CreateClassForm";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useErrorContext } from "../ErrorContext";

export type ClassData = {
  _id: string;
  title: string;
  description: string;
  chapters: string[];
};

const ClassPage = () => {
  const [data, setData] = useState<ClassData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { userData } = useAuth();
  const { setErrorMsg } = useErrorContext();

  const navigate = useNavigate();
  const url = window.location.pathname;

  const updateData = async () => {
    // Fetch the classes for the user
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/${
          userData?._id
        }/courses`
      );

      if (response.data && Array.isArray(response.data.courses)) {
        setData(response.data.courses);
      } else {
        setErrorMsg("Unexpected data format");
      }
    } catch (error) {
      setErrorMsg("Error fetching courses");
    }
  };

  useEffect(() => {
    updateData();
  }, [userData]);

  return (
    <div className="flex flex-col items-center gap-4 justify-between h-full w-full">
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
        <div className="container flex flex-col sm:flex-row flex-1 gap-4 overflow-scroll max-w-full sm:w-140">
          {data.map((item, index) => (
            <ClassCard
              key={item._id}
              title={item.title}
              description={item.description}
              chapters={item.chapters.length}
              className="sm:min-w-[30%]"
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
