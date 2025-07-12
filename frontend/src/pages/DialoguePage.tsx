import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { useChapter } from "../ChapterContext";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useScene } from "../SceneContext";

const QuestionPage = () => {
  const navigate = useNavigate();
  const { SceneData, setSceneData } = useScene();
  const { chapterData, setChapterData } = useChapter();
  const { userData } = useAuth();

  const chapterId = useParams().chapterId;
  const getChapter = async () => {
    try {
      console.log(chapterId);
      const response = await axios.get(
        `http://localhost:3000/chapter/${chapterId}`
      );

      const userData = response.data;

      setChapterData(userData.chapter.storyData);

      console.log(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    console.log("1", chapterId);
    getChapter();
  }, [chapterId, setChapterData]);

  const index = SceneData;
  function getImageUrl(name: string | undefined) {
    if (name === undefined) return;
    return new URL(`../assets/${name}.png`, import.meta.url).href;
  }

  if (!chapterData || chapterData === undefined) {
    return <div>Loading...</div>; // Or a loading spinner component
  }

  const dataStory = chapterData;
  // 2. Use the function in your component
  const monsterName = dataStory[index].character; // This can be dynamic (e.g., from state)
  const monsterImg = getImageUrl(monsterName);

  console.log("param", chapterId);
  const nextPage = () => {
    setSceneData(index + 1);
    if (dataStory[index].challange === "true") {
      navigate(`/${chapterId}/question`);
    } else {
      navigate(`/${chapterId}/dialogue`);
    }
  };

  console.log(userData);
  return (
    <div className="flex flex-col relative items-center justify-center h-screen w-screen text-xl gap-2">
      <img src={monsterImg} className="absolute h-[80%]" />
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
              <p className="font-bold text-2xl">{dataStory[index].text}</p>
              <div className="absolute bottom-2 left-0 flex flex-row text-center items-center">
                <img
                  src={userData?.avatar.toString()}
                  width={100}
                  height={100}
                />
                <p className="text-center"> {userData?.name} </p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default QuestionPage;
