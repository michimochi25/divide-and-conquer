import { twMerge } from "tailwind-merge";
import { Container } from "../components/Container";
import { Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ClassPage = () => {
  const { userData } = useAuth();

  return (
    <div className="p-4 w-screen h-screen flex items-center justify-center text-2xl gap-4 flex-col md:flex-row">
      <div className={twMerge("sprite ", `sprite-${userData?.avatar || 5}`)} />
      <Container
        className="container max-h-full h-132 sm:h-108 justify-between overflow-auto max-w-full sm:w-auto p-5 mx-2 sm:min-w-152"
        children={<Outlet />}
      />
    </div>
  );
};

export default ClassPage;
