import { useState, useEffect } from "react";

const Typewriter = ({
  text,
  isAnimating,
  speed = 30,
}: {
  text: string;
  isAnimating: boolean;
  speed?: number;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      setDisplayedText("");
      setIndex(0);
    } else {
      setDisplayedText(text);
      setIndex(text.length);
    }
  }, [isAnimating]);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    }
  }, [index, text, speed]);

  return <p className="font-bold text-xl">{displayedText}</p>;
};

export { Typewriter };
