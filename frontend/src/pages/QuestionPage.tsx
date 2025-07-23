import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { useChapter } from "../ChapterContext";
import { useScene } from "../SceneContext";
import { ErrorContainer } from "../components/ErrorContainer";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { chapterData } = useChapter();
  const { SceneData, setSceneData } = useScene();

  const chapterId = useParams().chapterId;
  const classId = useParams().classId;

  const [wrongAnswer, setWrongAnswer] = useState<number | null>(null);

  const index = SceneData;
  function getImageUrl(name: string | undefined) {
    if (name === undefined) return;
    return new URL(`../assets/${name}.png`, import.meta.url).href;
  }

  if (!chapterData || chapterData === undefined) {
    return <ErrorContainer message="PAGE NOT FOUND" />;
  }

  const dataStory = chapterData.storyData;
  const monsterName = dataStory[index - 1].character;
  const monsterImg = getImageUrl(monsterName);

  const nextPage = (opt_index: number) => {
    console.log("Chosen option: ", opt_index);
    console.log("Correct answer: ", opt_index);
    if (
      dataStory[index].options[opt_index].includes(
        dataStory[index].correctAnswer
      )
    ) {
      setSceneData(index + 1);
      navigate(`/${classId}/chapter/${chapterId}/dialogue`);
    } else {
      setWrongAnswer(opt_index);
      setTimeout(() => {
        setSceneData(index - 1);
        navigate(`/${classId}/chapter/${chapterId}/dialogue`);
        setWrongAnswer(null);
      }, 1000);
    }
  };

  return (
    <>
      <img src={monsterImg} className="absolute max-h-[80%] animate-in" />
      <div className="flex p-8 max-w-full h-full">
        <Container
          className="px-5"
          children={
            <div className="relative flex flex-col items-center justify-center h-full gap-5">
              <p className="font-bold text-2xl sm:text-xl">
                {dataStory[index].challengeText}
              </p>

              <div className="sm:grid sm:grid-cols-2 flex flex-col items-center justify-center gap-2">
                {dataStory[index] &&
                  dataStory[index].options.map((option, i) => (
                    <Button
                      key={i}
                      text={option}
                      className={twMerge(
                        "w-full h-full text-2xl sm:text-xl flex-1",
                        i === wrongAnswer ? "bg-red-300" : ""
                      )}
                      onClick={() => {
                        nextPage(i);
                      }}
                    />
                  ))}
              </div>
              {monsterName !== "null" ? (
                <div className="absolute bottom-2 left-0 flex flex-row text-center items-center">
                  <img src={monsterImg} width={100} height={100} />
                  <p className="text-center"> {monsterName} </p>
                </div>
              ) : (
                <></>
              )}
            </div>
          }
        />
      </div>
    </>
  );
};

export default QuestionPage;
