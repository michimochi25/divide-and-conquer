import { usersCollection, coursesCollection, chaptersCollection } from "./db";
import {
  Chapter,
  Question,
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
    return { exists: false, user: user };
  }

  return { exists: true, user: user };
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

  const finalStoryData = integrateChallengesIntoStory(scenes, questions);
  const chapter = {
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

  // // Execute the atomic update
  await coursesCollection.findOneAndUpdate(
    { _id: new ObjectId(courseId) },
    { $set: { chapters: chapterId } }
  );

  return chapter;
}

export async function getAllCourses(userId: string) {
  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!user || user === undefined) {
    throw new Error("USER_DOES_NOT_EXIST");
  }

  const courseIds = user.courses || [];
  const courseData = await coursesCollection
    .find({ _id: { $in: courseIds.map((id: string) => new ObjectId(id)) } })
    .toArray();

  return { courses: courseData || [] };
}

export async function getAllChapter(courseId: string) {
  const chapter = await chaptersCollection
    .find({
      courseId: courseId,
    })
    .toArray();
  return { chapters: chapter };
}

export async function updateUser(userId: string, data: any) {
  const user = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!user || user === undefined) {
    throw new Error("USER_DOES_NOT_EXIST");
  }

  const updateData: any = {};
  if (data.name) {
    updateData.name = data.name;
  }
  if (data.avatar) {
    updateData.avatar = data.avatar;
  }

  const result = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  return { user: result };
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

export async function getChapter(chapterId: string) {
  const chapter = await chaptersCollection.findOne({
    _id: new ObjectId(chapterId),
  });

  console.log("Backend", chapter);
  if (!chapter || chapter === undefined) {
    throw new Error(`ID ${chapterId} USER_DOES_NOT_EXIST`);
  }

  return { chapter: chapter };
}
