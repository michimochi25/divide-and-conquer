import { v4 as uuidv4 } from "uuid";
import { usersCollection, coursesCollection } from "./db";

function isValidName(name: String): string | boolean {
  if (name.length > 100) {
    return "NAME_TOO_LONG";
  }

  if (name.length < 1) {
    return "NAME_TOO_SHORT";
  }

  return true;
}

export async function AuthRegister(
  email: string,
  name: string,
  isAdmin: boolean
) {
  if (isValidName(name) !== true) {
    throw new Error(isValidName(name) as string);
  }

  const userId = uuidv4();

  // Create user
  const user = {
    name: name,
    email: email,
    createdAt: new Date(),
    lastSeen: new Date(),
    userId: userId,
    isAdmin: isAdmin,
  };

  // Add user to MongoDB
  await usersCollection.insertOne(user);
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
  description: string,
  chapter: string
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

  const course = {
    title: title,
    description: description,
    createdAt: new Date(),
    lastSeen: new Date(),
    userId: userId,
    chapter: chapter,
  };

  await coursesCollection.insertOne(course);
  return userId;
}

// export async function getAllCourse(userId: string) {
//   const user = await usersCollection.findOne({
//     userId: userId,
//   });

//   if (!user || user === undefined) {
//     throw new Error("USER_DOES_NOT_EXIST");
//   }

//   const courses = await use

//   return { user: user };
// }
