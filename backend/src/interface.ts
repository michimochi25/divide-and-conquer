import { ObjectId } from "mongodb";

export interface Course {
    _id: ObjectId,
    title: string,
    description: string,
    userId: string,
    chapters: ObjectId[]
}
