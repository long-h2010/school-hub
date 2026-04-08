import { TrendingUp, Globe, MoreHorizontal } from 'lucide-react';
import type { Post } from '../../../types/post';
import { useState } from 'react';
import PostMenu from './post-menu';

interface Props {
  post: Post;
  showMenu?: boolean;
}

const PostHeader: React.FC<Props> = ({ post, showMenu = true }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='p-4 flex items-center justify-between'>
      <div className='flex items-center space-x-3'>
        <img
          src={post.avatar}
          alt={post.author}
          className='w-10 h-10 rounded-full'
        />
        <div>
          <div className='flex items-center space-x-2'>
            <h3 className='font-semibold text-sm'>{post.author}</h3>
            {post.isHot && (
              <span className='bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-medium flex items-center'>
                <TrendingUp className='w-3 h-3 mr-1' />
                Hot
              </span>
            )}
          </div>
          <div className='flex items-center space-x-1 text-xs text-gray-500'>
            <span>{post.time}</span>
            <span>·</span>
            <Globe className='w-3 h-3' />
          </div>
        </div>
      </div>
      {showMenu && (
        <div className='relative'>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='hover:bg-gray-100 p-2 rounded-full'
          >
            <MoreHorizontal className='w-5 h-5 text-gray-600' />
          </button>

          {menuOpen && <PostMenu setMenuOpen={setMenuOpen} />}
        </div>
      )}
    </div>
  );
};

export default PostHeader;
