import React, { createContext, useContext, useState } from "react";

export interface Scene {
  characterImageUrl: string;
  type: "scene";
  background: string;
  character: string | null;
  text: string;
  challenge: string;
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface Challenge {
  type: "challenge";
  challengeText: string;
  options: string[];
  correctAnswer: number;
}

export type StoryDataItem = Scene | Challenge;

export interface Chapter {
  courseId: string;
  title: string;
  createdAt: Date;
  question: Question[];
  scenes: Scene[];
  storyData: StoryDataItem[];
}

type ChapterContextType = {
  chapterData: Chapter | undefined;
  setChapterData: React.Dispatch<React.SetStateAction<Chapter | undefined>>;
};

export const ChapterContext = createContext<ChapterContextType | undefined>(
  undefined
);

export const ChapterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chapterData, setChapterData] = useState<Chapter | undefined>();

  return (
    <ChapterContext.Provider value={{ chapterData, setChapterData }}>
      {children}
    </ChapterContext.Provider>
  );
};

export const useChapter = () => {
  const context = useContext(ChapterContext);
  if (context === undefined) {
    throw new Error("useChapter must be used within an ChapterProvider");
  }
  return context;
};
