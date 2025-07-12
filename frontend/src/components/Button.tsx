import { twMerge } from "tailwind-merge";

const Button = ({
  text,
  type,
  onClick,
  className = "",
}: {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        "px-4 py-2 bg-white/60 hover:bg-white text-black font-bold rounded-lg cursor-pointer border-3 border-black text-4xl",
        className
      )}
    >
      {text}
    </button>
  );
};

export { Button };
