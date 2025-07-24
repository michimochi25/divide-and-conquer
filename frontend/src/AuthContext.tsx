import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  userData: User | undefined;
  setUserData: React.Dispatch<React.SetStateAction<User | undefined>>;
  logout: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  avatar: number;
};

export const AuthProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | undefined;
}) => {
  const [userData, setUserData] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setUserData(undefined);
    // redirect to login page or home page
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://divide-and-conquer-production.up.railway.app/user/${userId}`
        );
        setUserData(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUserData(undefined);
      }
      setIsLoading(false);
      console.log("Done loading");
    };

    if (userId && !userData) {
      fetchData();
    }
  }, [userId]);

  return (
    <AuthContext.Provider value={{ userData, setUserData, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
