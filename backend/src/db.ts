import { MongoClient, Collection, Db } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.ATLAS_URI;
if (!uri) {
  throw new Error("ATLAS_URI environment variable is undefined");
}

const client = new MongoClient(uri);

// Collections
export let usersCollection: Collection;
export let coursesCollection: Collection;
export let chaptersCollection: Collection;
export let questionsCollection: Collection;

export async function connectDb() {
  try {
    await client.connect();
    const db = client.db();
    console.log(`Successfully connected to database: ${db.databaseName}`);

    // reset database
    // await db.dropDatabase();

    // Initialize collections
    usersCollection = db.collection("users");
    coursesCollection = db.collection("courses");
    chaptersCollection = db.collection("chapters");

    // Initialize collections if they don't exist
    const usersCount = await usersCollection.countDocuments();
    if (usersCount === 0) {
      await usersCollection.insertOne({
        name: "Admin",
        avatar: 5,
        email: "admin@gmail.com",
        createdAt: new Date(),
        isAdmin: true,
        courses: [], // if admin: courses created by admin, if student: courses enrolled in
      });
    }

    const coursesCount = await coursesCollection.countDocuments();
    if (coursesCount === 0) {
      await coursesCollection.insertOne({
        title: "Default Class",
        description: "Default class description",
        createdAt: new Date(),
        userId: "admin1234",
        chapters: [],
      });
    }

    const chaptersCount = await chaptersCollection.countDocuments();
    if (chaptersCount === 0) {
      await chaptersCollection.insertOne({
        courseId: "course1234",
        title: "Default Chapter",
        createdAt: new Date(),
        question: [],
        storyData: [],
      });
    }
  } catch (error) {
    console.error("Error found when connecting to MongoDB: ", error);
  }
}

export async function closeDb() {
  await client.close();
  console.log("Database connection closed");
}
