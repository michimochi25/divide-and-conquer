import { Question } from "./storyGenerator";

export async function generateQuestions(
  textData: string,
  count: number
): Promise<Question[]> {
  console.log(
    `[Backend] Generating ${count} questions for the provided text...`
  );

  const userPrompt = `
    Generate exactly ${count} distinct multiple-choice questions from the following materials ${textData}. All questions must be sequentially, in which each question helps to answer the next question, and the last question will be the question that asking for the understanding of the full concept. So all questions basically make a story, and the final solution of the story is in the last question. The way you create the question is try to connect the materials with the relatable real life situation for students, in which the calculation is simple but more focusing on how the materials concept be implemented in their life. All questions should be made to help understand deeply the application of the materials in real life situation, with only simple calculation but relatable scenario. For each question, provide 4 options and ensure the correct answer is one of those options
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
              description: "An array of 4 possible string answers.",
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
