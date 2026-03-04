interface Reply {
  id?: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  replyTo?: {
    id: string;
    name: string;
  };
  content: string;
  likeCounting: number;
  liked: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  likeCounting: number;
  replyCounting: number;
  replies: Reply[];
  liked: boolean;
  createdAt: string;
}
