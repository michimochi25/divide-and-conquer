import { useLocation, useNavigate } from "react-router-dom";
import BackIcon from "../assets/backward-icon.svg";

const BackButton = ({ back }: { back?: boolean }) => {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  let path = currentPath;
  const separator = currentPath.lastIndexOf("/");
  if (separator !== -1) {
    path = currentPath.substring(0, separator);
  }

  return (
    <button
      className="absolute top-4 left-4"
      onClick={() => (back ? navigate(-1) : navigate(path))}
    >
      <img
        src={BackIcon}
        alt="Arrow pointing to the left indicating backward navigation"
        className=" w-8 h-8 cursor-pointer"
      />
    </button>
  );
};

export { BackButton };
