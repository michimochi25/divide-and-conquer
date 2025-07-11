const Button = ({
  text,
  onClick,
  className = "",
}: {
  text: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-white/60 text-black font-bold rounded-lg cursor-pointer border-3 border-black text-4xl bg-opacity-50 ${className}`}
    >
      {text}
    </button>
  );
};

export { Button };
