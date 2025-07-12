import { usersCollection, coursesCollection, chaptersCollection } from "./db";
import {
  Chapter,
  Question,
  generateCharacterImage,
  generateStoryScenes,
  integrateChallengesIntoStory,
} from "./storyGenerator";
import { ObjectId } from "mongodb";

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
    avatar: 5,
    email: email,
    createdAt: new Date(),
    isAdmin: isAdmin,
    courses: [], // if admin: courses created by admin, if student: courses enrolled in
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
    throw new Error(`ID ${userId} USER_DOES_NOT_EXIST`);
  }

  return { user: user };
}

export async function checkEmailExists(email: string) {
  const user = await usersCollection.findOne({
    email: email,
  });

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
    _id: new ObjectId(userId),
  });

  if (!user || user === undefined) {
    throw new Error(`ID ${userId} USER_DOES_NOT_EXIST`);
  }

  if (!user.isAdmin) {
    throw new Error("USER_DOES_NOT_HAVE_ACCESS");
  }

  const course = {
    title: title,
    description: description,
    createdAt: new Date(),
    userId: userId,
    chapters: [],
  };

  const result = await coursesCollection.insertOne(course);
  const courseId = result.insertedId.toString();
  await enrollClass(userId, courseId);
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
    question: questions,
    storyData: finalStoryData,
  };

  console.log("[Backend] Chapter object created successfully.");

  const result = await chaptersCollection.insertOne(chapter);

  // Keep the ID as an ObjectId, DON'T use .toString()
  const chapterId = result.insertedId;

  // Find the course to update
  const filter = { courseId: courseId }; // Usually you filter by the course's _id

  // Prepare the update operation. This is now pushing an ObjectId.
  const update = {
    $put: { chapters: chapterId },
  };

  // Execute the atomic update
  await coursesCollection.findOneAndUpdate(filter, update);
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
  console.log("Chapter fetched:", chapter);
  return { chapters: chapter };
}

export async function enrollClass(userId: string, courseId: string) {
  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!user || user === undefined) {
    throw new Error("USER_DOES_NOT_EXIST");
  }

  const currCourses = user.courses || [];
  if (currCourses.includes(courseId)) {
    throw new Error("USER_ALREADY_ENROLLED");
  }

  currCourses.push(courseId);
  const result = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { courses: currCourses } }
  );

  if (result.modifiedCount === 0) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }

  return { success: true };
}
