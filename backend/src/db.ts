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

    // Initialize collections
    usersCollection = db.collection("users");
    coursesCollection = db.collection("courses");

    // Initialize collections if they don't exist
    const usersCount = await usersCollection.countDocuments();
    if (usersCount === 0) {
      await usersCollection.insertOne({
        users: [],
      });
    }

    const coursesCount = await coursesCollection.countDocuments();
    if (coursesCount === 0) {
      await coursesCollection.insertOne({
        courses: [],
      });
    }

    const chaptersCount = await chaptersCollection.countDocuments();
    if (chaptersCount === 0) {
      await chaptersCollection.insertOne({
        chapters: [],
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
