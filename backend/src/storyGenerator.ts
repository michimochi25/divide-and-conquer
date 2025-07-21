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
  correctAnswer: string;
}

export interface Challenge {
  type: "challenge";
  challengeText: string;
  options: string[];
  correctAnswer: string;
}

export type StoryDataItem = Scene | Challenge;

export interface Chapter {
  courseId: string;
  title: string;
  createdAt: Date;
  question: Question[];
  storyData: StoryDataItem[];
  _id: string;
}

export async function generateStoryScenes(
  topic: string,
  count: number,
  questionNum: number
): Promise<Scene[]> {
  console.log(`[Backend] Generating ${count} scenes for topic: "${topic}"...`);
  const userPrompt = `Generate a short story which has genre mystical and fantasy. 
    Break the story down into exactly ${
      count + questionNum
    } continuous scenes, included ${questionNum} challenges scenes existed, and 
    the story should be ended in the last scene. For each scene, 
    provide a descriptive background, a villain character from my enum (lizardeo, valakarza, lavacorn, goblin, dragopion, or not at all (so the villain shud not necesserally appear in each scene)),
    and the scene text. If no character is present, the character should be 
    null. If the scene trigger a challenge event (could be anything that require big action like battle with the villain) provide the information about 
    that in field challenge (e.g. the event trigger a battle in the next scene, then it should tell the this scene trigger a challenge), tell the main character that they need to solve the challenge in the next scene to kill the monster.
    The story should be in second person Point of View (You) (reader as the main character). Limit the scene into 3-5 sentences each.
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
              enum: [
                "lizardeo",
                "valakarza",
                "lavacorn",
                "goblin",
                "dragopion",
                "null",
              ],
            },
            text: {
              type: "STRING",
              description: "The narrative text for this scene.",
            },
            challenge: { type: "STRING", enum: ["false", "true"] },
          },
          required: ["type", "background", "text", "character"],
        },
      },
    },
  };

  const apiKey = process.env.GOOGLE_KEY_API;
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
  let questionIndex = 0;
  for (let i = 0; i < sceneCount; i++) {
    fullStory.push(storyData[i]);
    if (storyData[i].challenge == "true") {
      console.log(questionIndex, questions, questions[questionIndex]);
      const question = questions[questionIndex];
      const challenge: Challenge = {
        type: "challenge",
        challengeText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
      };
      fullStory.push(challenge);
      questionIndex += 1;
    }
  }
  return fullStory;
}
