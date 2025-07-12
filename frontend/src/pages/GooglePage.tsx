import { CustomGoogleLogin } from "../components/CustomGoogleLogin";
import { BackButton } from "../components/BackButton";

const GooglePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-xl gap-2">
      <BackButton />
      <h1 className="mb-4">Continue with Google</h1>
      <CustomGoogleLogin />
    </div>
  );
};

export default GooglePage;
