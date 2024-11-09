export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  user_email: string;
  created_at: string;
}

export interface Comment {
  id: number;
  content: string;
  post_id: number;
  user_email: string;
  created_at: string;
}

export enum Options {
  User = 'users',
  Post = 'posts',
  Comment = 'comments',
}
