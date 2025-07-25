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
import type { ClassData } from "./ClassesPage";
import { EditForm } from "../components/EditForm";
import { useErrorContext } from "../ErrorContext";

const ClassPage = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [viewForm, setViewForm] = useState(false);
  const [data, setData] = useState<ClassData>(useLocation().state?.data || {});
  const [editChapter, setEditChapter] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const classId = useParams().classId;
  const { setChapterData } = useChapter();
  const { userData } = useAuth();
  const { setSceneData } = useScene();
  const { setErrorMsg } = useErrorContext();

  const fetchChapters = async () => {
    console.log("Fetching chapters for classId:", classId);
    if (!classId) {
      return;
    }

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/course/${classId}/chapters`
      );
      console.log("Fetched chapters:", response.data);
      setChapters(response.data.chapters);
      setChapterData(response.data.chapters[0]);
    } catch (error) {
      setErrorMsg("Error fetching chapters");
    }
  };

  const getCourseInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/course/${classId}`
      );
      console.log("Fetched course info:", response.data);
      setData(response.data.course);
      return response.data.course;
    } catch (error) {
      setErrorMsg("Error fetching course info");
      return null;
    }
  };

  useEffect(() => {
    fetchChapters();
    if (Object.keys(data).length === 0) {
      getCourseInfo();
    }
  }, [classId]);

  const nextPage = async (index: number) => {
    await fetchChapters();
    const chapter = chapters[index];
    // setChapterData(chapter);
    setSceneData(0);
    navigate(`/${classId}/chapter/${chapter._id}/dialogue`);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 justify-start h-full w-full">
        <div className="flex items-center text-3xl font-bold mb-4 gap-4 justify-between w-full flex-wrap">
          {userData?.isAdmin && (
            <Button text="+" onClick={() => setViewForm(!viewForm)} />
          )}
          <p className="text-xl">{classId}</p>
          <p>{data.title}</p>
        </div>
        {viewForm ? (
          <CreateChapterForm
            classId={classId as string}
            setViewForm={setViewForm}
            fetchChapters={fetchChapters}
          />
        ) : (
          <div className="container flex flex-col gap-4 overflow-auto sm:w-140">
            {chapters.map((chapter, index) => (
              <ChapterCard
                key={index}
                title={chapter.title}
                play={() => {
                  nextPage(index);
                }}
                edit={() => {
                  setEditChapter(chapter._id);
                  setOpenModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className={`modal-overlay ${openModal ? "flex" : "hidden"}`}>
        <EditForm
          chapterId={editChapter}
          close={() => {
            setOpenModal(false);
            fetchChapters();
          }}
        />
      </div>
    </>
  );
};

export default ClassPage;
