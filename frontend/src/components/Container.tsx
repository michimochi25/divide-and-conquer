import { twMerge } from "tailwind-merge";

const Container = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-col items-center justify-center text-xl bg-white/60 rounded-lg shadow-lg border-3 border-black z-100",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Container };
