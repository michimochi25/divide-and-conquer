import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { CustomGoogleLogin } from "../components/CustomGoogleLogin";

const GooglePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-xl gap-2">
      <h1 className="mb-4">Continue with Google</h1>
      <CustomGoogleLogin />
    </div>
  );
};

export default GooglePage;
