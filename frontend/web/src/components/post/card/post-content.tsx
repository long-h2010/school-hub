import type { Post } from '../../../types/post';
import PostImages from './post-images';

interface Props {
  post: Post;
}

const PostContent: React.FC<Props> = ({ post }) => {
  return (
    <>
      <div className='px-4 pb-3'>
        <p className='text-sm'>{post.content}</p>
      </div>
      {post.images && <PostImages images={post.images} />}
    </>
  );
};

export default PostContent;
