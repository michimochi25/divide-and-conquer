import { v4 as uuidv4 } from "uuid";

import { usersCollection, coursesCollection, chaptersCollection } from "./db";
import {
  Chapter,
  Question,
  generateStoryScenes,
  integrateChallengesIntoStory,
} from "./storyGenerator";
import { ObjectId } from "mongodb";

import { UpdateFilter } from "mongodb";
import { Course } from "./interface";

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
    isAdmin: isAdmin,
  };

  // Add user to MongoDB
  let userId = "";
  await usersCollection.insertOne(user).then((result) => {
    userId = result.insertedId.toString();
  });

  if (!userId) {
    throw new Error("USER_CREATION_FAILED");
  }

  return { userId: userId };
}

export async function getUser(userId: string) {
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

  if (!user || user === undefined) {
    throw new Error("USER_DOES_NOT_EXIST");
  }

  return { user: user };
}

export async function checkEmailExists(email: string) {
  const user = await usersCollection.findOne({
    email: email,
  });

  console.log("Checking email:", email, "Found user:", user);

  if (!user || user === undefined) {
    return { exists: false, userId: null };
  }

  return { exists: true, userId: user._id.toString() };
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
  const scenes = await generateStoryScenes(title, 5, questions.length);

  if (!scenes || scenes.length === 0) {
    throw new Error("Scene generation failed, cannot create chapter.");
  }

  const finalStoryData = integrateChallengesIntoStory(scenes, questions);
  const chapter: Chapter = {
    courseId: courseId,
    title: title,
    createdAt: new Date(),
    question: questions,
    storyData: finalStoryData,
  };

  console.log("[Backend] Chapter object created successfully.");

  const result = await chaptersCollection.insertOne(chapter);

  // Keep the ID as an ObjectId, DON'T use .toString()
  const chapterId = result.insertedId;

  // // Find the course to update
  // const filter = { courseId: courseId }; // Usually you filter by the course's _id

  // // Prepare the update operation. This is now pushing an ObjectId.
  // const update: UpdateFilter<Course> = {
  //   $set: {
  //     chapters: chapterId,
  //   },
  // };

  // // Execute the atomic update
  // await coursesCollection.findOneAndUpdate(filter, update);
  return chapter;
}

export async function getAllCourses(userId: string) {
  const courses = await coursesCollection
    .find({
      userId: userId,
    })
    .toArray();

  return { courses: courses };
}

export async function getAllChapter(courseId: string) {
  const chapter = await chaptersCollection
    .find({
      courseId: courseId,
    })
    .toArray();

  return { chapters: chapter };
}

export async function getChapter(chapterId: string) {
  const chapter = await chaptersCollection.findOne({
    _id: new ObjectId(chapterId),
  });

  return { chapters: chapter };
}
