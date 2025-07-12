import { twMerge } from "tailwind-merge";

const Input = ({
  type = "text",
  placeholder = "",
  value,
  setter,
  name,
  className,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  setter: (e: React.SetStateAction<string>) => void;
  name?: string;
  className?: string;
}) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => setter(event.target.value)}
      className={twMerge(
        "px-4 py-2 border-2 border-black rounded-lg text-xl bg-white/60 text-black",
        className
      )}
    />
  );
};
export { Input };
