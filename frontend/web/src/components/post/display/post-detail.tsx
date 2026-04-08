import { X } from 'lucide-react';
import { PostHeader, PostContent, PostStats, PostActions } from '../card';
import type { Post } from '../../../types/post';
import { CommentSection } from '../comment';

interface Props {
  post: Post;
  onClose: () => void;
  onLike: (postId: string) => void;
}

const PostDetail: React.FC<Props> = ({ post, onClose, onLike }) => {
  return (
    <>
      <div
        className='fixed inset-0 backdrop-blur-sm bg-opacity-70 z-50'
        onClick={onClose}
      />
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl z-50 overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-4'>
          <h2 className='text-xl font-bold'>Bài viết của {post.author}</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full'
          >
            <X className='w-6 h-6 text-gray-600' />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className='flex-1 overflow-y-auto'>
          {/* Post Content */}
          <div className='p-4'>
            <PostHeader post={post} />
            <PostContent post={post} />
            <PostStats post={post} />
            <PostActions
              post={post}
              onLike={onLike}
              onOpenPostDetail={() => {}}
            />
          </div>

          <CommentSection post={post.id} />
        </div>
      </div>
    </>
  );
};

export default PostDetail;
