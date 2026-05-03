import { useRef } from 'react';
import type { Post } from '../../../types/post';
import PostActions from './post-actions';
import PostContent from './post-content';
import PostHeader from './post-header';
import PostStats from './post-stats';
import AxiosClient from '../../../api/axios-client';

interface Props {
  post: Post;
  onLike: (postId: string) => void;
  onOpenPostDetail: (postId: string) => void;
}

const PostCard: React.FC<Props> = ({ post, onLike, onOpenPostDetail }) => {
  const lastTimeLikeRef = useRef<number>(0);

  const handleClick = async () => {
    const now = Date.now();
    if (now - lastTimeLikeRef.current < 1000) return; 
    lastTimeLikeRef.current = now;

    onLike(post.id);

    try {
      await AxiosClient.put(
        `${import.meta.env.VITE_APP_LIKE_POST_ENDPOINT}/${post.id}`,
      );
    } catch (err) {
      console.log(err);
      onLike(post.id); 
    }
  };

  return (
    <div className='bg-white rounded-lg shadow mb-4'>
      <PostHeader post={post} />
      <PostContent post={post} />
      <PostStats post={post} />
      <PostActions
        post={post}
        onLike={handleClick}
        onOpenPostDetail={onOpenPostDetail}
      />
    </div>
  );
};

export default PostCard;
