import React, { createContext, useContext, useState } from "react";

type SceneContextType = {
  SceneData: number;
  setSceneData: React.Dispatch<React.SetStateAction<number>>;
};

export const SceneContext = createContext<SceneContextType | undefined>(
  undefined
);

export const SceneProvider = ({ children }: { children: React.ReactNode }) => {
  const [SceneData, setSceneData] = useState<number>(0);

  return (
    <SceneContext.Provider value={{ SceneData, setSceneData }}>
      {children}
    </SceneContext.Provider>
  );
};

export const useScene = () => {
  const context = useContext(SceneContext);
  if (context === undefined) {
    throw new Error("useScene must be used within an SceneProvider");
  }
  return context;
};
