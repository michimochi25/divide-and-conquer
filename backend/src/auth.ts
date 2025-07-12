import { v4 as uuidv4 } from "uuid";
import { usersCollection, coursesCollection } from "./db";

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
  const user = await usersCollection.findOne({
    userId: userId,
  });

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
    return { exists: false };
  }

  return { exists: true };
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
