import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { useChapter } from "../ChapterContext";
import { useScene } from "../SceneContext";
import { ErrorContainer } from "../components/ErrorContainer";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { chapterData, setChapterData } = useChapter();
  const { SceneData, setSceneData } = useScene();

  const index = SceneData;
  function getImageUrl(name: string | undefined) {
    if (name === undefined) return;
    return new URL(`../assets/${name}.png`, import.meta.url).href;
  }

  if (!chapterData || chapterData === undefined) {
    return <ErrorContainer />;
  }

  const dataStory = chapterData.storyData;
  const monsterName = dataStory[index].character;
  const monsterImg = getImageUrl(monsterName);
  console.log(monsterImg, monsterName);

  const nextPage = (opt_index: number) => {
    if (
      dataStory[index].options[opt_index] === dataStory[index].correctAnswer
    ) {
      setSceneData(index + 1);
    } else {
      setSceneData(index - 1);
    }

    navigate(`/dialogue`);
  };

  return (
    <div className="flex flex-col relative items-center justify-center h-screen w-screen text-xl gap-2">
      <img src={monsterImg} className="absolute h-[80%]" />
      <div className="flex p-8 max-w-full h-full">
        <Container
          className="px-5"
          children={
            <div className="relative flex flex-col items-center justify-center h-full gap-5">
              <p className="font-bold text-2xl">
                {dataStory[index].challengeText}
              </p>

              <div className="grid grid-cols-2 items-center justify-center gap-2">
                {dataStory[index] &&
                  dataStory[index].options.map((option, i) => (
                    <Button
                      key={i}
                      text={option}
                      className="w-full h-full text-2xl flex-1"
                      onClick={() => {
                        nextPage(i);
                      }}
                    />
                  ))}
              </div>
              <div className="absolute bottom-2 left-0 flex flex-row text-center items-center">
                <img src={monsterImg} width={100} height={100} />
                <p className="text-center"> {monsterName} </p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default QuestionPage;
