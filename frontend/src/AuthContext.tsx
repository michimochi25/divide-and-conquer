import React, { createContext, useContext, useState } from "react";

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<User | undefined>();

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
