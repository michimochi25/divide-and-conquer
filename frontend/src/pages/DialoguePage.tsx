import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/Container";
import { useChapter } from "../ChapterContext";
import { useAuth } from "../AuthContext";
import { useScene } from "../SceneContext";
import { ErrorContainer } from "../components/ErrorContainer";
import React, { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

const DialoguePage = () => {
  const navigate = useNavigate();
  const { SceneData, setSceneData } = useScene();
  const { chapterData } = useChapter();
  const { userData } = useAuth();

  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const timerIdRef = useRef(null);

  const chapterId = useParams().chapterId;
  const classId = useParams().classId;
  const index = SceneData;
  function getImageUrl(name: string | undefined) {
    if (name === undefined) return;
    return new URL(`../assets/${name}.png`, import.meta.url).href;
  }

  if (!chapterData || chapterData === undefined) {
    return <ErrorContainer message="PAGE NOT FOUND" />;
  }

  const dataStory = chapterData?.storyData[index];

  useEffect(() => {
    if (dataStory?.text) {
      let i = 0;
      setDisplayText("");
      setIsAnimating(true);

      const type = () => {
        if (i < dataStory.text.length) {
          setDisplayText((prev) => prev + dataStory.text.charAt(i));
          i++;

          timerIdRef.current = setTimeout(type, 50);
        } else {
          setIsAnimating(false);
          timerIdRef.current = null;
        }
      };
      type();

      return () => {
        clearTimeout(timerIdRef.current);
      };
    }
  }, [dataStory?.text]);

  const monsterName = dataStory.character as string;
  const monsterImg = getImageUrl(monsterName);
  const nextPage = () => {
    if (index + 1 === dataStory.length) {
      setSceneData(0);
      navigate(`/user/${userData?._id}/classes/${classId}/`);
    }

    setSceneData(index + 1);
    if (dataStory.challange === "true") {
      navigate(`/${classId}/chapter/${chapterId}/question`);
    } else {
      navigate(`/${classId}/chapter/${chapterId}/dialogue`);
    }
  };

  const handleContainerClick = () => {
    if (isAnimating) {
      clearTimeout(timerIdRef.current);
      setIsAnimating(false);
      setDisplayText(dataStory.text);
    } else {
      nextPage();
    }
  };

  return (
    <div className="flex flex-col relative items-center justify-center h-screen w-screen text-xl gap-2">
      {monsterName !== "null" && (
        <img src={monsterImg} className="absolute h-[80%]" />
      )}
      <div className="flex p-8 w-screen h-full">
        <Container
          className="px-5 absolute bottom-0 left-5 m-5 p-5 w-11/12 items-start justify-start"
          children={
            <div
              className="relative flex flex-col items-center justify-center h-full gap-5"
              onClick={() => {
                handleContainerClick();
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
                  <p className="font-bold text-xl">{displayText}</p>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default DialoguePage;
