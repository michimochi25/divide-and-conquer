const ChapterCard = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="p-4 w-full border-3 rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-start"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
    </div>
  );
};

export { ChapterCard };
