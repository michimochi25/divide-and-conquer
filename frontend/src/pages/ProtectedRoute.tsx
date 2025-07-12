import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated on component mount
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Authed!", token);
      setAuthed(true);
    }
  }, []);

  return <div>{authed ? <>{children}</> : <Navigate to="/signin" />}</div>;
};

export default ProtectedRoute;
