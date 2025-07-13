import { BackButton } from "../components/BackButton";
import { ErrorContainer } from "../components/ErrorContainer";

const ErrorPage = () => {
  return (
    <div>
      <BackButton />
      <ErrorContainer message="PAGE NOT FOUND" />
    </div>
  );
};

export default ErrorPage;
