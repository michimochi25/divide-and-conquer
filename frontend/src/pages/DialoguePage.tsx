import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/Container";
import { useChapter } from "../ChapterContext";
import { useAuth } from "../AuthContext";
import { useScene } from "../SceneContext";
import { ErrorContainer } from "../components/ErrorContainer";
import { twMerge } from "tailwind-merge";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { SceneData, setSceneData } = useScene();
  const { chapterData } = useChapter();
  const { userData } = useAuth();

  const chapterId = useParams().chapterId;
  const classId = useParams().classId;
  const index = SceneData;
  function getImageUrl(name: string | undefined) {
    if (name === undefined) return;
    return new URL(`../assets/${name}.png`, import.meta.url).href;
  }

  if (!chapterData || chapterData === undefined) {
    return <ErrorContainer />;
  }

  const dataStory = chapterData?.storyData[index];
  // 2. Use the function in your component

  const monsterName = dataStory.character as string; // This can be dynamic (e.g., from state)
  const monsterImg = getImageUrl(monsterName);
  const nextPage = () => {
    setSceneData(index + 1);
    if (dataStory.challange === "true") {
      navigate(`/${classId}/chapter/${chapterId}/question`);
    } else {
      navigate(`/${classId}/chapter/${chapterId}/dialogue`);
    }
  };

  console.log("BJIR", dataStory, monsterName, monsterImg);
  return (
    <div className="flex flex-col relative items-center justify-center h-screen w-screen text-xl gap-2">
      {monsterName !== "null" && (
        <img src={monsterImg} className="absolute h-[80%]" />
      )}
      <div className="flex p-8 max-w-full h-full">
        <Container
          className="px-5 absolute bottom-0 left-0 m-5 p-5"
          children={
            <div
              className="relative flex flex-col items-center justify-center h-full gap-5"
              onClick={() => {
                nextPage();
              }}
            >
              <div className="flex flex-row text-center items-center">
                <div className="w-15%">
                  <img
                    className={twMerge("sprite ", `sprite-${userData?.avatar}`)}
                  />
                </div>
                <div className="flex flex-2 flex-col text-left">
                  <p className="font-bold text-left text-2xl">
                    {" "}
                    {userData?.name}{" "}
                  </p>
                  <p className="font-bold text-xl">{dataStory.text}</p>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default QuestionPage;
