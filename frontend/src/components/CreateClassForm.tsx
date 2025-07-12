import { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

const CreateClassForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle class creation logic here
    console.log("Class Created:", { title, description });
    // Reset form fields
    setTitle("");
    setDescription("");
  };

  return (
    <form className="flex-1" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 w-140 justify-center items-center h-full">
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
        {/* <label htmlFor="description" className="text-lg font-semibold">
          Description
        </label>
        <textarea
          id="description"
          className="border-3 p-2 rounded"
          placeholder="Enter class description"
        ></textarea> */}
      </div>
      <Button type="submit" text="Create" onClick={() => {}} />
    </form>
  );
};

export default CreateClassForm;
