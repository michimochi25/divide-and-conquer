import { useNavigate } from "react-router-dom";
import BackIcon from "../assets/backward-icon.svg";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button className="absolute top-4 left-4" onClick={() => navigate(-1)}>
      <img
        src={BackIcon}
        alt="Arrow pointing to the left indicating backward navigation"
        className=" w-8 h-8 cursor-pointer"
      />
    </button>
  );
};

export { BackButton };
