import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

/**
 * UnauthenticatedPage component checks if the user is authenticated.
 * If authenticated, it redirects to the user's page; otherwise, it renders the children.
 */
const UnauthenticatedPage = ({ children }: { children: React.ReactNode }) => {
  const { userData, isLoading } = useAuth();

  // Wait until auth status is confirmed
  if (isLoading) {
    return null;
  }

  if (userData) {
    return <Navigate to={`/user/${userData._id}`} replace />;
  }

  return <>{children}</>;
};

export default UnauthenticatedPage;
