export interface User {
  id: string;
  name: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
}
