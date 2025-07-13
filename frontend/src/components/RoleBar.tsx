import { Container } from "./Container";
import coinImg from "../assets/coin.svg";

const RoleBar = ({ role }: { role: string }) => {
  return (
    <Container
      children={
        <div className="flex justify-between items-center w-full py-2 px-5">
          <span className="text-xl font-bold">{role}</span>
        </div>
      }
    />
  );
};

export default RoleBar;
