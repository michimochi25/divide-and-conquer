import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BackButton } from "../components/BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useErrorContext } from "../ErrorContext";

const RegisterPage = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  const location = useLocation();
  const { email, token } = location.state;
  const { setErrorMsg } = useErrorContext();

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/register`,
        {
          name: name,
          isAdmin: role === "STUDENT" ? false : true,
          email: email,
        }
      );
      console.log("Registration successful", resp.data);
      localStorage.setItem("token", token);
      navigate(`/user/${resp.data.userId}`);
    } catch (error) {
      setErrorMsg("Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-xl gap-2">
      <BackButton />
      <form
        className="flex flex-col items-center justify-center h-screen w-screen text-xl gap-5 sm:gap-0"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-1 sm:flex-row items-center justify-between mb-4 w-[70%]">
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
        <div className="flex flex-col gap-1 sm:flex-row items-center justify-between mb-4 w-[70%]">
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
