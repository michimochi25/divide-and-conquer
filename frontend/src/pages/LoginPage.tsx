import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

const LoginPage = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(`Role selected: ${role}`);
  };

  return (
    <form
      className="flex flex-col items-center justify-center h-screen w-screen text-xl"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between mb-4 w-[70%]">
        <h1>I am a</h1>
        <div className="flex gap-2">
          <Button
            text="STUDENT"
            onClick={() => setRole("STUDENT")}
            className="w-48"
          />
          <Button
            text="ADMIN"
            onClick={() => setRole("ADMIN")}
            className="w-48"
          />
        </div>
      </div>
      <div className="flex items-center justify-between mb-4 w-[70%]">
        <h1>My name is</h1>
        <Input name="name" placeholder="Name" value={name} setter={setName} />
      </div>
    </form>
  );
};

export default LoginPage;
