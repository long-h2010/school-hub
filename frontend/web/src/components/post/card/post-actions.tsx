import { Heart, MessageCircle } from 'lucide-react';
import type { Post } from '../../../types/post';
import { t } from 'i18next';

interface Props {
  post: Post;
  onLike: (postId: string) => void;
  onOpenPostDetail: (postId: string) => void;
}

const PostActions: React.FC<Props> = ({ post, onLike, onOpenPostDetail }) => {
  return (
    <div className='px-4 py-1 flex'>
      <button
        onClick={() => onLike(post.id)}
        className={`flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center ${
          post.liked ? 'text-red-500' : 'text-gray-600'
        }`}
      >
        <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
        <span className='text-sm font-medium'>{t('like')}</span>
      </button>
      <button
        onClick={() => onOpenPostDetail(post.id)}
        className='flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center text-gray-600'
      >
        <MessageCircle className='w-5 h-5' />
        <span className='text-sm font-medium'>{t('comment')}</span>
      </button>
    </div>
  );
};

export default PostActions;
