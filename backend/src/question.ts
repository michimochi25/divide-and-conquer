import { Question } from "./storyGenerator";

export async function generateQuestions(
  textData: string,
  count: number
): Promise<Question[]> {
  console.log(
    `[Backend] Generating ${count} questions for the provided text...`
  );

  const userPrompt = `
    Generate exactly ${count} distinct multiple-choice questions from the following text ${textData}. The questions should be asking about something that is important for students to memorize, preparing them for the theoretical exam. For each question, provide 4 options with answer and ensure the correct answer is one of those options.
  `;

  const payload = {
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        description: `An array of exactly ${count} multiple-choice questions.`,
        items: {
          type: "OBJECT",
          properties: {
            questionText: {
              type: "STRING",
              description: "The text of the question.",
            },
            options: {
              type: "ARRAY",
              description:
                "An array of exactly 4 possible string answers to the question. Do not prefix the option with alphabet (A.,B.,C.,D.), but rather the answer directly.",
              items: { type: "STRING" },
            },
            correctAnswer: {
              type: "STRING",
              description:
                "The correct answer, which must exactly match one of the items in the 'options' array.",
            },
          },
          required: ["questionText", "options", "correctAnswer"],
        },
      },
    },
  };

  const apiKey = "AIzaSyCkill1F5-Qkr06Gt1v_oiNumZC_JYrxaI";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
    console.log(`[Backend - candidates] ${result}`);

    if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
      const jsonText = result.candidates[0].content.parts[0].text;
      console.log("[Backend] Successfully received questions from AI.");
      return JSON.parse(jsonText) as Question[];
    } else {
      console.error("[Backend] Unexpected API response structure:", result);
      if (result.promptFeedback?.blockReason) {
        throw new Error(
          `Content blocked by API. Reason: ${result.promptFeedback.blockReason}.`
        );
      }
      throw new Error("The AI returned an empty or invalid response.");
    }
  } catch (error) {
    console.error("[Backend] Error in generateQuestions:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
