export interface User {
  name: string;
  email: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  upvotes: number;
  replies: number;
}