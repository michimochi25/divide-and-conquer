import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChapterCard } from "../components/ChapterCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Chapter } from "../../../backend/src/storyGenerator";
import { CreateChapterForm } from "../components/CreateChapterForm";
import axios from "axios";
import { useChapter } from "../ChapterContext";
import { useScene } from "../SceneContext";
import { useAuth } from "../AuthContext";

const ClassPage = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [viewForm, setViewForm] = useState(false);
  const data = useLocation().state?.data || { title: "Not Found" };
  const classId = useParams().classId || data._id;
  const { setChapterData } = useChapter();
  const { userData } = useAuth();
  const { setSceneData } = useScene();

  const fetchChapters = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/course/${classId}/chapters`
      );
      console.log("Fetched chapters:", response.data);
      setChapters(response.data.chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const nextPage = (chapter: Chapter) => {
    if (userData?.isAdmin) return;
    setChapterData(chapter);
    setSceneData(0);
    navigate(`/dialogue`);
  };

  console.log(chapters);
  return (
    <div className="flex flex-col items-center gap-4 justify-between h-full w-full">
      <div className="flex items-center text-3xl font-bold mb-4 gap-4 justify-between w-full">
        {userData?.isAdmin && (
          <Button text="+" onClick={() => setViewForm(!viewForm)} />
        )}
        <p className="text-xl">{classId}</p>
        <p>{data.title}</p>
      </div>
      {viewForm ? (
        <CreateChapterForm classId={classId} setViewForm={setViewForm} />
      ) : (
        <div className="container flex flex-col gap-4 overflow-auto w-140">
          {chapters.map((chapter, index) => (
            <ChapterCard
              key={index}
              title={chapter.title}
              onClick={() => {
                nextPage(chapter);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassPage;
