import { BackButton } from "../components/BackButton";
import { ErrorContainer } from "../components/ErrorContainer";

const ErrorPage = () => {
  return (
    <div>
      <BackButton back={true} />
      <ErrorContainer message="PAGE NOT FOUND" />
    </div>
  );
};

export default ErrorPage;
