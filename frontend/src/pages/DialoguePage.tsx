import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Container } from "../components/Container";
import { useChapter, type StoryDataItem } from "../ChapterContext";
import { useAuth } from "../AuthContext";
import { useScene } from "../SceneContext";
import { ErrorContainer } from "../components/ErrorContainer";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Typewriter } from "../components/Typewriter";

const DialoguePage = () => {
  const navigate = useNavigate();
  const { SceneData, setSceneData } = useScene();
  const { chapterData } = useChapter();
  const { userData } = useAuth();
  const { setNightMode } = useOutletContext<{
    setNightMode: (value: boolean) => void;
  }>();

  const [isAnimating, setIsAnimating] = useState(false);
  const [monsterName, setMonsterName] = useState<string>("null");
  const [monsterImg, setMonsterImg] = useState<string | undefined>(undefined);

  const chapterId = useParams().chapterId;
  const classId = useParams().classId;
  const index = SceneData;

  function getImageUrl(name: string | undefined | null) {
    if (!name || name == "null") return;
    return new URL(`../assets/${name}.png`, import.meta.url).href;
  }

  if (!chapterData || chapterData === undefined) {
    return <ErrorContainer message="PAGE NOT FOUND" />;
  }

  const dataStory: StoryDataItem = chapterData?.storyData[index];
  const queue = dataStory.type === "scene" ? dataStory.text.split(".") : [];

  useEffect(() => {
    if (dataStory.type === "scene") {
      setNightMode(dataStory.background === "night");
      if (dataStory?.text) {
        setMonsterName(dataStory.character as string);
        console.log(`Monster name: ${monsterName}, ${dataStory.character}`);
        setMonsterImg(getImageUrl(dataStory.character as string));
        setIsAnimating(true);
      }
    }
  }, [dataStory]);

  const nextPage = () => {
    console.log(SceneData, index, chapterData);
    if (index + 1 >= chapterData?.storyData.length) {
      setSceneData(0);
      navigate(`/user/${userData?._id}/classes/${classId}/`);
      return;
    }

    setSceneData(index + 1);
    if (dataStory.type === "scene" && dataStory.challenge === "true") {
      navigate(`/${classId}/chapter/${chapterId}/question`);
    } else {
      navigate(`/${classId}/chapter/${chapterId}/dialogue`);
    }
  };

  const handleContainerClick = () => {
    if (isAnimating) {
      setIsAnimating(false);
    } else {
      nextPage();
    }
  };

  return (
    <>
      {monsterName !== "null" && (
        <img src={monsterImg} className="absolute max-h-[80%]" />
      )}
      <div
        className="flex w-screen h-full cursor-pointer"
        onClick={() => {
          handleContainerClick();
        }}
      >
        <Container
          className="px-5 absolute bottom-0 sm:right-50 sm:translate-x-45 sm:m-5 p-5 w-full sm:w-11/12 items-start justify-start"
          children={
            <div className="relative flex flex-col items-center justify-center h-full gap-5 w-full">
              <div className="grid grid-cols-[1fr_2fr] text-center items-center gap-2 w-full">
                <div className="w-[15%]">
                  <div
                    className={twMerge("sprite ", `sprite-${userData?.avatar}`)}
                  />
                </div>
                <div className="text-left">
                  <p className="font-bold text-left text-2xl">
                    {" "}
                    {userData?.name}{" "}
                  </p>
                  <Typewriter
                    text={dataStory.type === "scene" ? queue : []}
                    setIsAnimating={setIsAnimating}
                    isAnimating={isAnimating}
                  />
                </div>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
};

export default DialoguePage;
