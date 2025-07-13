const ClassCard = ({
  title,
  description,
  chapters,
  onClick,
}: {
  title: string;
  description: string;
  chapters: number;
  onClick: () => void;
}) => {
  return (
    <div
      className="p-4 w-full border-3 rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-start"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="class-description text-gray-600">{description}</p>
      <p className="mt-2">{chapters} Chapters</p>
    </div>
  );
};

export { ClassCard };
