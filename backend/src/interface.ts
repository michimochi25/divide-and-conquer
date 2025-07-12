export interface Datastore {
  users: Array<User>;
  quizzes: Array<Quiz>;
}

export interface User {
  userId: number;
  name: string;
  email: string;
}

export interface Quiz {
  quizId: number;
  name: string;
  ownerId: number;
  description: string;
  questions: Array<Question>;
}

export interface Question {
  questionId: number;
  problem: string;
  options: Array<Answer>;
}

export interface Answer {
  answerId: number;
  answer: string;
  correct: boolean;
}
