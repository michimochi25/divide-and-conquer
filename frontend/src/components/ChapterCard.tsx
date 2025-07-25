import playIcon from "../assets/play.png";
import editIcon from "../assets/edit.png";

const ChapterCard = ({
  title,
  play,
  edit,
}: {
  title: string;
  play: () => void;
  edit: () => void;
}) => {
  return (
    <div className="p-4 w-full border-3 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center justify-between">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex gap-5">
        <button onClick={edit} className="icon-button">
          <img src={editIcon} className="w-8 cursor-pointer" />
        </button>
        <button onClick={play} className="icon-button">
          <img src={playIcon} className="w-8 cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export { ChapterCard };
