import { useGoogleLogin } from "@react-oauth/google";
import { GoogleButton } from "./GoogleButton";
import { useNavigate } from "react-router-dom";

const CustomGoogleLogin = () => {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log("Login Success:", codeResponse);
      // Send the authorization code to your backend server
      // The backend will exchange it for an access token and refresh token.
      // Example with axios:
      // const tokens = await axios.post('http://localhost:3001/auth/google', {
      //   code: codeResponse.code,
      // });
      // console.log(tokens.data);
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
    // This uses the recommended Authorization Code Flow
    flow: "auth-code",
  });

  return (
    <div>
      <GoogleButton onClick={login} />
    </div>
  );
};

export { CustomGoogleLogin };
