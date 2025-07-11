import { Container } from "./Container";
import coinImg from "../assets/coin.svg";

const RoleBar = ({ role, points }: { role: string; points: number }) => {
  return (
    <Container
      children={
        <div className="flex justify-between items-center w-full py-2 px-5">
          <span className="text-xl font-bold">{role}</span>
          <div className="text-xl flex items-center gap-2">
            <img src={coinImg} width={20} height={20} />
            <span>{points} points</span>
          </div>
        </div>
      }
    />
  );
};

export default RoleBar;
