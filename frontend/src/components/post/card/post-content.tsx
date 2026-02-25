import type { Post } from '../../../types/post';

interface Props {
    post: Post;
}

const PostContent: React.FC<Props> = ({ post }) => {
    return (
        <>
            <div className='px-4 pb-3'>
                <p className='text-sm'>{post.content}</p>
            </div>
            {post.image && <img src={post.image} alt='Post' className='w-full' />}
        </>
    );
};

export default PostContent;
