import { useGoogleLogin } from "@react-oauth/google";
import { GoogleButton } from "./GoogleButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";

const CustomGoogleLogin = () => {
  const navigate = useNavigate();
  const { setUserData } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoRes = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const resp = await axios.get(
          `http://localhost:3000/user/email/${userInfoRes.data.email}`
        );

        if (resp.data.exists) {
          console.log("User exists, navigating to user page");
          navigate(`/user/${resp.data.user._id}`);
          setUserData(resp.data.user);
        } else {
          navigate("/register", {
            state: { email: userInfoRes.data.email },
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
    flow: "implicit",
  });

  return (
    <div>
      <GoogleButton onClick={login} />
    </div>
  );
};

export { CustomGoogleLogin };
