import { twMerge } from "tailwind-merge";

const ClassCard = ({
  title,
  description,
  chapters,
  onClick,
  className = "",
}: {
  title: string;
  description: string;
  chapters: number;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "p-4 w-full border-3 rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-start",
        className
      )}
      onClick={onClick}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="class-description text-gray-600 text-center">
        {description}
      </p>
      <p className="mt-2">{chapters} Chapters</p>
    </div>
  );
};

export { ClassCard };
