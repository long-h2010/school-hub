import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PostHeader, PostContent, PostStats, PostActions } from '../card';
import type { Post } from '../../../types/post';
import { CommentsList } from '.';
import AxiosClient from '../../../api/axios-client';
import type { Comment } from '../../../types/comment';

interface Props {
    post: Post;
    onClose: () => void;
    onLike: (postId: string) => void;
}

const PostDetail: React.FC<Props> = ({ post, onClose, onLike }) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');

    const getComments = async () => {
        const res = await AxiosClient.get(
            `${import.meta.env.VITE_APP_GET_COMMENT_IN_POST_ENDPOINT}/${post.id}`
        );
        const commentsData = res.data;
        setComments(
            commentsData.map((cmt: any) => ({
                id: cmt._id,
                owner: {
                    id: cmt.owner._id,
                    name: cmt.owner.name,
                    avatar: cmt.owner.avatar,
                },
                content: cmt.content,
                likeCounting: cmt.likeCounting,
                replyCounting: cmt.replyCounting,
                replies: cmt.replies,
                liked: cmt.liked,
                createdAt: cmt.createdAt,
            }))
        );
    };

    useEffect(() => {
        getComments();
    }, [post]);

    if (!post) return null;

    const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
        setComments(
            comments.map((comment) => {
                if (comment.id === commentId && !isReply) {
                    return {
                        ...comment,
                        liked: !comment.liked,
                        likeCounting: comment.liked
                            ? comment.likeCounting - 1
                            : comment.likeCounting + 1,
                    };
                }
                if (isReply && comment.id === parentId && comment.replies) {
                    return {
                        ...comment,
                        replies: comment.replies.map((reply) => {
                            if (reply.id === commentId) {
                                return {
                                    ...reply,
                                    liked: !reply.liked,
                                    likeCounting: reply.liked
                                        ? reply.likeCounting - 1
                                        : reply.likeCounting + 1,
                                };
                            }
                            return reply;
                        }),
                    };
                }
                return comment;
            })
        );
    };

    const handleToggleReply = (commentId: string) => {
        setComments(
            comments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        showReply: !comment.showReply,
                    };
                }
                return comment;
            })
        );
    };

    return (
        <>
            <div className='fixed inset-0 backdrop-blur-sm bg-opacity-70 z-50' onClick={onClose} />
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl z-50 overflow-hidden flex flex-col'>
                {/* Header */}
                <div className='flex items-center justify-between p-4'>
                    <h2 className='text-xl font-bold'>Bài viết của {post.author}</h2>
                    <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-full'>
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
                        <PostActions post={post} onLike={onLike} onOpenPostDetail={() => {}} />
                    </div>

                    {/* Comments Section */}
                    <div className='p-4'>
                        <h3 className='font-semibold text-lg mb-4'>Tất cả bình luận</h3>

                        {/* Comment Input */}
                        <div className='flex items-start space-x-2 mb-6'>
                            <img
                                src='https://ui-avatars.com/api/?name=Ban&background=4267B2&color=fff'
                                alt='Avatar'
                                className='w-8 h-8 rounded-full'
                            />
                            <div className='flex-1'>
                                <div className='bg-gray-100 rounded-2xl px-4 py-2'>
                                    <input
                                        type='text'
                                        placeholder='Viết bình luận...'
                                        className='w-full bg-transparent outline-none text-sm'
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && newComment.trim()) {
                                                setNewComment('');
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Comments List */}
                        <CommentsList
                            comments={comments}
                            handleLikeComment={handleLikeComment}
                            setReplyTo={setReplyTo}
                            handleToggleReply={handleToggleReply}
                            replyText={replyText}
                            setReplyText={setReplyText}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostDetail;
