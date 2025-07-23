import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const GameLayout = () => {
  const [nightMode, setNightMode] = useState(false);
  useEffect(() => {
    console.log("Mode: ", nightMode);
  }, [nightMode]);

  return (
    <div
      className={twMerge(
        "flex flex-col relative items-center justify-center h-screen w-screen text-xl gap-2",
        nightMode ? "night-bg" : ""
      )}
    >
      <Outlet context={{ setNightMode }} />
    </div>
  );
};

export default GameLayout;
