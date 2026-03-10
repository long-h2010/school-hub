import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/auth-context';
import CommentsList from './comments-list';
import AxiosClient from '../../../api/axios-client';
import { mapCommentApi } from '../../../utils/map-api';
import type { Comment } from '../../../types/comment';
import CommentInput from './comment-input';

interface Props {
  post: string;
}

const CommentSection: React.FC<Props> = ({ post }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const getComments = useCallback(async () => {
    const res = await AxiosClient.get(
      `${import.meta.env.VITE_APP_GET_COMMENT_IN_POST_ENDPOINT}/${post}`,
    );
    const commentsData = res.data;
    setComments(commentsData.map((cmt: any) => mapCommentApi(cmt)));
  }, [post]);

  const handleAddComment = useCallback(async () => {
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      owner: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
      content: newComment,
      likeCounting: 0,
      replyCounting: 0,
      replies: [],
      liked: false,
      createdAt: new Date().toISOString(),
    };

    setComments([optimisticComment, ...comments]);
    setNewComment('');

    try {
      await AxiosClient.post(
        `${import.meta.env.VITE_APP_COMMENT_ENDPOINT}/${post}`,
        {
          content: newComment,
        },
      );
    } catch (error) {
      setComments(comments.filter((c) => c.id !== optimisticComment.id));
    }
  }, [post, newComment]);

  useEffect(() => {
    getComments();
  }, [post, getComments]);

  if (!post) return null;

  const handleLikeComment = (
    commentId: string,
    isReply: boolean = false,
    parentId?: string,
  ) => {
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
      }),
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
      }),
    );
  };

  const handleReply = useCallback(async (commentId: string) => {
    const optimisticReply = {
      id: `temp-reply-${Date.now()}`,
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
      replyTo: {
        id: commentId,
        name: comments.find((c) => c.id === commentId)?.owner.name || '',
      },
      content: replyText,
      likeCounting: 0,
      liked: false,
      createdAt: new Date().toISOString(),
    };

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, optimisticReply],
            replyCounting: comment.replyCounting + 1,
          };
        }
        return comment;
      })
    );
    console.log('Replying to comment', commentId, 'with content:', replyText);
    setReplyText('');
  }, [replyTo]);

  return (
    <div className='p-4'>
      <h3 className='font-semibold text-lg mb-4'>Tất cả bình luận</h3>

      <CommentInput
        value={newComment}
        onChange={setNewComment}
        onSubmit={handleAddComment}
      />

      <CommentsList
        comments={comments}
        handleLikeComment={handleLikeComment}
        setReplyTo={setReplyTo}
        handleToggleReply={handleToggleReply}
        replyText={replyText}
        setReplyText={setReplyText}
        handleReply={handleReply}
      />
    </div>
  );
};

export default CommentSection;
