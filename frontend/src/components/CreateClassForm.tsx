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
import { useErrorContext } from "../ErrorContext";

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
  const { setErrorMsg } = useErrorContext();

  const handleCreateClass = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || title.trim() === "") {
      setErrorMsg("Title is required");
      return;
    }

    if (!description || description.trim() === "") {
      setErrorMsg("Description is required");
      return;
    }

    if (!userData?._id) {
      setErrorMsg("User ID is required");
      return;
    }

    try {
      const response = await axios.post(
        "${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/add-course",
        {
          userId: userData?._id,
          title,
          description,
        }
      );

      if (!response.data) {
        throw new Error("Failed to create class");
      }

      updateData();
      setTitle("");
      setDescription("");
      setShowForm(false);
    } catch (error) {
      setErrorMsg("Error creating class");
    }
  };

  return (
    <>
      {isAdmin ? (
        <form
          className="flex-1 flex flex-col justify-between"
          onSubmit={(e) => handleCreateClass(e)}
        >
          <div className="flex flex-col gap-4 sm:w-140 items-center">
            <div className="flex sm:flex-row flex-col gap-2 w-full justify-between items-center">
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
            <div className="flex sm:flex-row flex-col gap-2 w-full justify-between items-center">
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
