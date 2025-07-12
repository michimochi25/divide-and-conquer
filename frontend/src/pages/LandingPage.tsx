import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-xl gap-2">
      <header className="flex flex-col items-center justify-center">
        <h1>Welcome to</h1>
        <h1 className="font-bold">Divide and Conquer</h1>
      </header>
      <Button text="START" onClick={() => navigate("/signin")} />
    </div>
  );
};

export default LandingPage;
