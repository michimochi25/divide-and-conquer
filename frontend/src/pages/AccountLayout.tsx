import { Outlet } from "react-router-dom";
import { BackButton } from "../components/BackButton";

const AccountLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-xl gap-2">
      <BackButton />
      <Outlet />
    </div>
  );
};

export default AccountLayout;
