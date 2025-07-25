import { useParams } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const userId = useParams().userId;
  return <AuthProvider userId={userId}>{children}</AuthProvider>;
};

export default AuthWrapper;
