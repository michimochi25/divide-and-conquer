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
import { useErrorContext } from "../ErrorContext";

const CreateClassFormStudent = ({
  setShowForm,
  updateData,
}: {
  setShowForm: Dispatch<SetStateAction<boolean>>;
  updateData: () => void;
}) => {
  const [id, setId] = useState("");
  const { userData } = useAuth();
  const { setErrorMsg } = useErrorContext();

  const handleEnrolClass = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || id.trim() === "") {
      setErrorMsg("Class ID is required");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/${
          userData?._id
        }/courses`,
        {
          courseId: id,
        }
      );

      if (!response.data) {
        throw new Error("Failed to create class");
      }

      updateData();
      setShowForm(false);
    } catch (error) {
      setErrorMsg("Error creating class");
    }
  };

  return (
    <form
      className="flex-1 flex flex-col justify-between"
      onSubmit={(e) => handleEnrolClass(e)}
    >
      <div className="flex flex-col gap-4 sm:w-140 items-center">
        <div className="flex gap-2 w-full justify-between items-center">
          <label htmlFor="title" className="text-xl font-semibold">
            Class ID
          </label>
          <Input
            type="text"
            className="border-3 p-2 rounded w-[90%]"
            placeholder="e.g. 6871fa69f7483c819e811c14"
            setter={setId}
            value={id}
          />
        </div>
      </div>
      <Button
        type="submit"
        text="Enroll"
        onClick={() => {}}
        className="text-2xl w-full"
      />
    </form>
  );
};

export { CreateClassFormStudent };
