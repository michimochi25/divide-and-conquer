import { Question } from "./storyGenerator";

function shuffleArray(array: string[]): string[] {
  // Create a shallow copy to ensure the original array is not modified.
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Parses the structured text response from the Gemini API into an array of Question objects.
 * This version uses a single, robust regular expression to handle multi-line content
 * and formatting variations from the AI, making it much more reliable than splitting by lines.
 * @param responseText The raw text output from the AI.
 * @returns An array of parsed Question objects.
 */
function parseGeminiResponse(responseText: string): Question[] {
  const questions: Question[] = [];
  const questionBlockRegex =
    /\*\*Question:\*\*(?<questionText>[\s\S]*?)\* \*\*Correct:\*\*(?<correctAnswer>[\s\S]*?)\* \*\*Incorrect:\*\*(?<incorrect1>[\s\S]*?)\* \*\*Incorrect:\*\*(?<incorrect2>[\s\S]*?)\* \*\*Incorrect:\*\*(?<incorrect3>[\s\S]*?)(?=---|\s*$)/g;

  let match;
  // loop through all matches found in the response text
  while ((match = questionBlockRegex.exec(responseText)) !== null) {
    const { questionText, correctAnswer, incorrect1, incorrect2, incorrect3 } =
      match.groups!;

    if (
      questionText &&
      correctAnswer &&
      incorrect1 &&
      incorrect2 &&
      incorrect3
    ) {
      const allOptions = [
        correctAnswer.trim(),
        incorrect1.trim(),
        incorrect2.trim(),
        incorrect3.trim(),
      ];

      const shuffledOptions = shuffleArray(allOptions);
      const correctIndex = shuffledOptions.indexOf(correctAnswer.trim());

      questions.push({
        questionText: questionText.trim(),
        correctAnswer: correctIndex,
        options: shuffledOptions,
      });
    }
  }

  if (questions.length === 0 && responseText.length > 10) {
    console.warn(
      "[Backend Parser] The parser could not find any valid question blocks in the AI's response. The response may have been in an unexpected format. Response Text:",
      responseText
    );
  }

  return questions;
}

/**
 * Generates a specified number of multiple-choice questions from a given text.
 * @param textData The source text to generate questions from.
 * @param count The exact number of questions to generate.
 * @returns A promise that resolves to an array of Question objects.
 */
export async function generateQuestions(
  textData: string,
  count: number
): Promise<Question[]> {
  console.log(
    `[Backend] Generating ${count} questions for the provided text...`
  );

  // This "few-shot" prompt includes a perfect example for the AI to follow,
  // which dramatically increases the reliability of its output format.
  const userPrompt = `
    Generate exactly ${count} distinct multiple-choice questions from the text provided below.
    You must provide ONLY the formatted question data. Do not add any other text, explanation, or conversational filler.

    ### TEXT ###
    ${textData}
    ### END TEXT ###

    You MUST follow this exact format for every single question. Here is an example:

    ### EXAMPLE ###
    **Question:** What is the capital of Australia?
    * **Correct:** Canberra
    * **Incorrect:** Sydney
    * **Incorrect:** Melbourne
    * **Incorrect:** Brisbane
    ---

    Now, generate the ${count} questions based on the provided text.
`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      // A lower temperature (e.g., 0.4) makes the output more focused and deterministic,
      // which is better for following strict formatting rules.
      temperature: 0.4,
      maxOutputTokens: 4096, // Increased slightly for more complex questions
    },
  };

  const apiKey = process.env.GOOGLE_KEY_API;
  if (!apiKey) {
    throw new Error("GOOGLE_KEY_API environment variable is not set.");
  }
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody}`
      );
    }

    const result = await response.json();

    // Check for safety blocks or other reasons for an empty response first.
    if (!result.candidates || result.candidates.length === 0) {
      if (result.promptFeedback?.blockReason) {
        throw new Error(
          `Content blocked by API. Reason: ${result.promptFeedback.blockReason}.`
        );
      }
      throw new Error(
        "The AI returned an empty or invalid response (no candidates)."
      );
    }

    const responseText = result.candidates[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("The AI response was missing the expected text content.");
    }

    const questions = parseGeminiResponse(responseText);

    console.log(
      `[Backend] Successfully parsed ${questions.length} questions from AI.`
    );
    return questions;
  } catch (error) {
    console.error("[Backend] Error in generateQuestions:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
