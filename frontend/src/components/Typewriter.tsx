import { useState, useEffect, type SetStateAction, type Dispatch } from "react";
import { twMerge } from "tailwind-merge";

const Typewriter = ({
  text,
  isAnimating,
  setIsAnimating,
  speed = 30,
  className = "",
}: {
  text: string[];
  isAnimating: boolean;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  speed?: number;
  className?: string;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0); // which string in the array
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      setDisplayedText("");
      setTextIndex(0);
      setCharIndex(0);
    } else {
      setDisplayedText(text[textIndex] || "");
    }
  }, [isAnimating]);

  useEffect(() => {
    if (!isAnimating || textIndex >= text.length) return;
    const current = text[textIndex];

    if (charIndex < current.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + current.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else {
      // finished animating current text
      setIsAnimating(false);
    }
  }, [charIndex, text, speed]);

  return (
    <p className={twMerge("font-bold text-xl", className)}>{displayedText}</p>
  );
};

export { Typewriter };
