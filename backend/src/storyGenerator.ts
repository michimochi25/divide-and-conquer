export interface Scene {
  characterImageUrl: string;
  type: "scene";
  background: string;
  character: string | null;
  text: string;
}

// Defines the structure for a question.
export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

// Defines the structure for a challenge, derived from a question.
export interface Challenge {
  type: "challenge";
  challengeText: string;
  options: string[];
  correctAnswer: string;
}

// A union type representing any item that can be in the storyData array.
export type StoryDataItem = Scene | Challenge;

// Defines the final structure for the chapter object.
export interface Chapter {
  courseId: string;
  title: string;
  createdAt: Date;
  question: Question[];
  storyData: StoryDataItem[];
}

export async function generateStoryScenes(
  topic: string,
  count: number,
  questionNum: number,
): Promise<Scene[]> {
  console.log(`[Backend] Generating ${count} scenes for topic: "${topic}"...`);
  const userPrompt = `Generate a short story about "${topic}". 
    Break the story down into exactly ${count} continuous scenes, included ${questionNum} challanges scenes existed, and 
    the story should be ended in the last scene. For each scene, 
    provide a descriptive background, a detailed character description 
    (e.g., "A wise old wizard with a long white beard and starry robes"),
    and the scene text. If no character is present, the character should be 
    null. For each scene, if the scene trigger a challange event provide the information about 
    that (e.g. the event trigger a battle in the next scene, then it should tell the this scene trigger a challange).
    The story should be in second person Point of View (You) (reader as the main character).
    Ensure the output is a valid JSON array.`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        description: `An array of ${count} story scenes.`,
        items: {
          type: "OBJECT",
          properties: {
            type: { type: "STRING", enum: ["scene"] },
            background: {
              type: "STRING",
              description:
                "A descriptive filename for a background image, e.g., 'haunted_castle.jpg'",
              enum: ["night", "day"],
            },
            character: {
              type: "STRING",
              description:
                "A detailed description of the character in the scene, or null.",
            },
            text: {
              type: "STRING",
              description: "The narrative text for this scene.",
            },
            challange: { type: "STRING", enum: ["false", "true"] },
          },
          required: ["type", "background", "text", "character"],
        },
      },
    },
  };

  const apiKey = "AIzaSyCkill1F5-Qkr06Gt1v_oiNumZC_JYrxaI";
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

    if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
      const jsonText = result.candidates[0].content.parts[0].text;
      console.log("[Backend] Successfully received scenes from AI.");
      return JSON.parse(jsonText) as Scene[];
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
    console.error("[Backend] Error in generateStoryScenes:", error);
    throw error;
  }
}

export function integrateChallengesIntoStory(
  storyData: Scene[],
  questions: Question[]
): StoryDataItem[] {
  const fullStory: StoryDataItem[] = [];
  const sceneCount = storyData.length;
  for (let i = 0; i < sceneCount; i++) {
    fullStory.push(storyData[i]);
    if (questions[i]) {
      const question = questions[i];
      const challenge: Challenge = {
        type: "challenge",
        challengeText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
      };
      fullStory.push(challenge);
    }
  }
  return fullStory;
}

export async function generateCharacterImage(
  characterDescription: string
): Promise<string | null> {
  console.log(`[Backend] Generating image for: "${characterDescription}"...`);
  // Enhance the prompt for better image results
  const imagePrompt = `Portrait of a character: ${characterDescription}. Fantasy art style, detailed, high quality.`;

  const payload = {
    instances: [{ prompt: imagePrompt }],
    parameters: { sampleCount: 1 },
  };
  const apiKey = "AIzaSyCkill1F5-Qkr06Gt1v_oiNumZC_JYrxaI";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Image generation API request failed with status ${response.status}`
      );
    }

    const result = await response.json();
    if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
      console.log("[Backend] Successfully received image data.");
      return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
    } else {
      console.error("[Backend] Image generation returned no data:", result);
      return null;
    }
  } catch (error) {
    console.error("[Backend] Error in generateCharacterImage:", error);
    return null;
  }
}
