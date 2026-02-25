import { Heart } from 'lucide-react';
import type { Post } from '../../../types/post';
import { t } from 'i18next';

interface Props {
    post: Post;
}

const PostStats: React.FC<Props> = ({ post }) => {
    return (
        <div className='px-4 py-2 flex items-center justify-between text-sm text-gray-600'>
            <div className='flex items-center space-x-1'>
                {post.likes > 0 ? (
                    <>
                        <div className='flex -space-x-1'>
                            <div className='w-5 h-5 bg-red-500 rounded-full flex items-center justify-center'>
                                <Heart className='w-3 h-3 text-white' />
                            </div>
                        </div>
                        <span>{post.likes}</span>
                    </>
                ) : (
                    <></>
                )}
            </div>
            <div className='flex space-x-3'>
                <span>{post.comments > 0 ? post.comments : 0} {t('comment-count')}</span>
            </div>
        </div>
    );
};

export default PostStats;
