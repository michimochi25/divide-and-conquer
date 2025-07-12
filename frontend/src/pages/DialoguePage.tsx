import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { useChapter } from "../ChapterContext";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useScene } from "../SceneContext";
import { ErrorContainer } from "../components/ErrorContainer";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { SceneData, setSceneData } = useScene();
  const { chapterData, setChapterData } = useChapter();
  const { userData } = useAuth();

  //   const chapterId = useParams().chapterId;
  //   const getChapter = async () => {
  //     try {
  //       console.log(chapterId);
  //       const response = await axios.get(
  //         `http://localhost:3000/chapter/${chapterId}`
  //       );

  //       const userData = response.data;

  //       setChapterData(userData.chapter.storyData);

  //       console.log(userData);
  //     } catch (error) {
  //       console.error("Failed to fetch user data:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     console.log("1", chapterId);
  //     getChapter();
  //   }, [chapterId, setChapterData]);

  const index = SceneData;
  function getImageUrl(name: string | undefined) {
    if (name === undefined) return;
    return new URL(`../assets/${name}.png`, import.meta.url).href;
  }

  if (!chapterData || chapterData === undefined) {
    return <ErrorContainer />;
  }

  const dataStory = chapterData?.storyData[index];

  console.log(chapterData, dataStory);
  // 2. Use the function in your component

  const monsterName = dataStory.character as string; // This can be dynamic (e.g., from state)
  const monsterImg = getImageUrl(monsterName);

  const nextPage = () => {
    setSceneData(index + 1);
    if (dataStory.challange === "true") {
      navigate(`/question`);
    } else {
      navigate(`/dialogue`);
    }
  };

  console.log("BJIR", userData, monsterName);
  return (
    <div className="flex flex-col relative items-center justify-center h-screen w-screen text-xl gap-2">
      {!monsterName && <img src={monsterImg} className="absolute h-[80%]" />}
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
                <img
                  src={userData?.avatar.toString()}
                  width={100}
                  height={100}
                />
                <div className="flex flex-2 flex-col text-left">
                  <p className="font-bold text-left text-2xl"> Ricky </p>
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
