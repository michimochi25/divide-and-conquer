import { useErrorContext } from "../ErrorContext";
import { Button } from "./Button";
import { Container } from "./Container";

const ErrorContainer = ({
  message = "PAGE NOT FOUND",
  alert = false,
}: {
  message: string;
  alert?: boolean;
}) => {
  const { setErrorMsg } = useErrorContext();
  return (
    <div className="slide-in flex justify-center text-xl gap-2">
      <div className="flex p-8 max-w-full max-h-full">
        <Container
          className="p-5"
          children={
            <div className="font-bold text-2xl flex items-center justify-center h-full gap-5">
              <p className="">{message}</p>
              {alert && (
                <button
                  onClick={() => setErrorMsg("")}
                  className="z-9999 cursor-pointer hover:underline"
                >
                  X
                </button>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export { ErrorContainer };
