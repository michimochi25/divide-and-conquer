import { Container } from "./Container";
import notesIcon from "../assets/notes.svg";

const CreateChapterForm = () => {
  return (
    <form className="flex-1 flex flex-col justify-between w-full h-full">
      <Container
        children={
          <div className="w-full h-full p-5 flex flex-col justify-center items-center gap-3 cursor-pointer">
            <p className="w-94 text-center">
              Upload course notes and make AI-Generated questions
            </p>
            <img src={notesIcon} width={45} height={45} />
            <p>accepts .pdf, .txt</p>
          </div>
        }
      />
    </form>
  );
};

export { CreateChapterForm };
