import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { CreateClassFormStudent } from "./CreateClassFormStudent";

const CreateClassForm = ({
  setShowForm,
  updateData, // Default to empty function if not provided
  isAdmin = true,
}: {
  setShowForm: Dispatch<SetStateAction<boolean>>;
  updateData: () => void;
  isAdmin: boolean;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { userData } = useAuth();

  const handleCreateClass = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/add-course", {
        userId: userData?.userId,
        title,
        description,
      });

      if (!response.data) {
        throw new Error("Failed to create class");
      }

      updateData();
      setTitle("");
      setDescription("");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  return (
    <>
      {isAdmin ? (
        <form
          className="flex-1 flex flex-col justify-between"
          onSubmit={(e) => handleCreateClass(e)}
        >
          <div className="flex flex-col gap-4 w-140 items-center">
            <div className="flex gap-2 w-full justify-between items-center">
              <label htmlFor="title" className="text-xl font-semibold">
                Class Title
              </label>
              <Input
                type="text"
                className="border-3 p-2 rounded"
                placeholder="MATH1231: Calculus I"
                setter={setTitle}
                value={title}
              />
            </div>
            <div className="flex gap-2 w-full justify-between items-center">
              <label htmlFor="title" className="text-xl font-semibold">
                Description
              </label>
              <Input
                type="text"
                className="border-3 p-2 rounded"
                placeholder="Level 1 Math course"
                setter={setDescription}
                value={description}
              />
            </div>
          </div>
          <Button
            type="submit"
            text="Create"
            onClick={() => {}}
            className="text-2xl w-full"
          />
        </form>
      ) : (
        <CreateClassFormStudent
          setShowForm={setShowForm}
          updateData={updateData}
        />
      )}
    </>
  );
};

export default CreateClassForm;
