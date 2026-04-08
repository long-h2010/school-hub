export type TabType = "new" | "hot" | "following" | "liked";

export interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  liked: boolean;
  isHot: boolean;
}

export interface NewPost {
  content?: string;
  images?: File[];
  videos?: string[];
}
