import { v4 as uuidv4 } from "uuid";
import { usersCollection, coursesCollection, chaptersCollection } from "./db";
import {
  Chapter,
  Question,
  generateCharacterImage,
  generateStoryScenes,
  integrateChallengesIntoStory,
} from "./storyGenerator";

function isValidName(name: string): string | boolean {
  if (name.length > 100) {
    return "NAME_TOO_LONG";
  }

  if (name.length < 1) {
    return "NAME_TOO_SHORT";
  }

  return true;
}

export async function authRegister(
  email: string,
  name: string,
  isAdmin: boolean
) {
  if (isValidName(name) !== true) {
    throw new Error(isValidName(name) as string);
  }

  // Create user
  const user = {
    name: name,
    email: email,
    createdAt: new Date(),
    lastSeen: new Date(),
    isAdmin: isAdmin,
  };

  let userId = null;
  // Add user to MongoDB
  await usersCollection.insertOne(user).then((result) => {
    userId = result.insertedId;
  });
  return userId;
}

export async function getUser(userId: string) {
  const user = await usersCollection.findOne({
    userId: userId,
  });

  if (!user || user === undefined) {
    throw new Error("USER_DOES_NOT_EXIST");
  }

  return { user: user };
}

export async function addCourse(
  userId: string,
  title: string,
  description: string
) {
  const user = await usersCollection.findOne({
    userId: userId,
  });

  if (!user || user === undefined) {
    throw new Error("USER_DOES_NOT_EXIST");
  }

  if (!user.isAdmin) {
    throw new Error("USER_DOES_NOT_HAVE_ACCESS");
  }
  const courseId = uuidv4();
  const course = {
    title: title,
    description: description,
    createdAt: new Date(),
    lastSeen: new Date(),
    userId: userId,
    courseId: courseId,
    chapters: [],
  };

  await coursesCollection.insertOne(course);
  return userId;
}

export async function addChapter(
  courseId: string,
  title: string,
  questions: Question[]
) {
  const scenes = await generateStoryScenes(title, questions.length);

  if (!scenes || scenes.length === 0) {
    throw new Error("Scene generation failed, cannot create chapter.");
  }

  for (const scene of scenes) {
    if (scene.character) {
      const imageUrl = await generateCharacterImage(scene.character);
      if (imageUrl) {
        scene.characterImageUrl = imageUrl;
      }
    }
  }

  const finalStoryData = integrateChallengesIntoStory(scenes, questions);
  const chapter: Chapter = {
    courseId: courseId,
    title: title,
    createdAt: new Date(),
    lastSeen: new Date(),
    question: questions,
    storyData: finalStoryData,
  };

  console.log("[Backend] Chapter object created successfully.");
  // await chaptersCollection.insertOne(chapter);
  return chapter;
}
