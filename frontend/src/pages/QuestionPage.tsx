import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import monsterImg from "../assets/monster1.png";

const QuestionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col relative items-center justify-center h-screen w-screen text-xl gap-2">
      <img
        src={monsterImg}
        className="absolute h-[80%]"
      />
      <div className="flex p-8 max-w-full h-full">
        <Container
          className="px-5"
          children={
            <div className="relative flex flex-col items-center justify-center h-full gap-5">
              <p className="font-bold text-2xl">Which one is better?</p>

              <div className="grid grid-cols-2 items-center justify-center gap-2">
                <Button
                  text="My classes"
                  className="w-full h-full text-2xl flex-1"
                  onClick={() => {}}
                />
                <Button
                  text="Change profile"
                  className="w-full h-full text-2xl flex-1"
                  onClick={() => {}}
                />
                <Button
                  text="Settings"
                  className="w-full h-full text-2xl flex-1"
                  onClick={() => {}}
                />
                <Button
                  text="Apple"
                  className="w-full h-full text-2xl flex-1"
                  onClick={() => {}}
                />
              </div>
              <img
                src={monsterImg}
                width={100}
                height={100}
                className="absolute bottom-2 left-0"
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default QuestionPage;
