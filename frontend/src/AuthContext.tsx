import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  userData: User | undefined;
  setUserData: React.Dispatch<React.SetStateAction<User | undefined>>;
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

  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/user/${userId}`);
      setUserData(response.data.user);
      console.log("User data fetched:", response.data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUserData(undefined);
    }
  };

  useEffect(() => {
    if (userId && !userData) {
      // Fetch user data if userId is present and userData is not set
      fetchUserData(userId);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
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
