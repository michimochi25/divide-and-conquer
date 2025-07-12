import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BackButton } from "../components/BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  const location = useLocation();
  const { email } = location.state;
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const resp = await axios.post("http://localhost:3000/register", {
        name: name,
        isAdmin: role === "STUDENT" ? false : true,
        email: email,
      });
      console.log("Registration successful", resp.data);

      navigate(`/user/${resp.data.userId}`); // Navigate to user page with the new user ID
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-xl gap-2">
      <BackButton />
      <form
        className="flex flex-col items-center justify-center h-screen w-screen text-xl"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between mb-4 w-[70%]">
          <h1>I am a</h1>
          <div className="flex gap-2">
            <Button
              type="button"
              text="STUDENT"
              onClick={() => setRole("STUDENT")}
              className={role === "STUDENT" ? "w-48 bg-white/100" : "w-48"}
            />
            <Button
              type="button"
              text="ADMIN"
              onClick={() => setRole("ADMIN")}
              className={role === "ADMIN" ? "w-48 bg-white/100" : "w-48"}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mb-4 w-[70%]">
          <h1>My name is</h1>
          <Input name="name" placeholder="Name" value={name} setter={setName} />
        </div>
        <Button
          text="REGISTER"
          type="submit"
          className="w-[70%] bg-white/100"
          onClick={() => {}}
        />
      </form>
    </div>
  );
};

export default RegisterPage;
