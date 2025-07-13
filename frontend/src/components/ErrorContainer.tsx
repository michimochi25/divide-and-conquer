import { Container } from "./Container";

const ErrorContainer = ({
  message = "PAGE NOT FOUND",
}: {
  message: string;
}) => {
  return (
    <div className="flex flex-col relative items-center justify-center h-screen w-screen text-xl gap-2">
      <div className="flex p-8 max-w-full max-h-full">
        <Container
          className="px-5"
          children={
            <div className="relative flex flex-col items-center justify-center h-full gap-5">
              <p className="font-bold text-2xl">{message}</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export { ErrorContainer };
