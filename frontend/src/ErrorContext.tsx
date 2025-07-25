import { createContext, useContext, useState } from "react";

interface ErrorContextType {
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => useContext(ErrorContext);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <ErrorContext.Provider value={{ errorMsg, setErrorMsg }}>
      {children}
    </ErrorContext.Provider>
  );
}

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
};
