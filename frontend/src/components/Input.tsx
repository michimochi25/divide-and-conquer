const Input = ({
  type = "text",
  placeholder = "",
  value,
  setter,
  name,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  setter: (e: React.SetStateAction<string>) => void;
  name?: string;
}) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => setter(event.target.value)}
      className="px-4 py-2 border-2 border-black rounded-lg text-xl bg-white/60 text-black"
    />
  );
};
export { Input };
