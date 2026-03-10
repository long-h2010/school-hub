import { Heart } from 'lucide-react';
import { TextButton } from '../../common';
import type { Comment, Reply } from '../../../types/comment';
import CommentInput from './comment-input';

interface Props {
  comments: any[];
  handleLikeComment: (
    commentId: string,
    isReply?: boolean,
    parentId?: string,
  ) => void;
  setReplyTo: (commentId: string) => void;
  handleToggleReply: (commentId: string) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleReply: (commentId: string) => void;
}

const CommentsList: React.FC<Props> = ({
  comments,
  handleLikeComment,
  setReplyTo,
  handleToggleReply,
  replyText,
  setReplyText,
  handleReply,
}) => {
  return (
    <div className='space-y-4'>
      {comments && comments.length > 0 ? (
        comments.map((comment: Comment) => (
          <div key={comment.id} className='space-y-2'>
            <div className='flex items-start space-x-2'>
              <img
                src={comment.owner.avatar}
                alt={comment.owner.name}
                className='w-8 h-8 rounded-full'
              />
              <div className='flex-1'>
                <div className='relative inline-block'>
                  <div className='bg-gray-100 rounded-2xl px-4 py-2'>
                    <h4 className='font-semibold text-sm'>{comment.owner.name}</h4>
                    <p className='text-sm'>{comment.content}</p>
                  </div>
                  {/* Like Badge on Comment Bubble */}
                  {comment.likeCounting > 0 && (
                    <div className='absolute -bottom-2 -right-1 bg-white rounded-full shadow-md px-2 py-0.5 flex items-center space-x-1 border border-gray-200'>
                      <Heart className='w-3 h-3 text-red-500 fill-red-500' />
                      <span className='text-xs font-medium text-gray-700'>
                        {comment.likeCounting}
                      </span>
                    </div>
                  )}
                </div>
                <div className='flex items-center space-x-4 mt-2 px-4'>
                  <TextButton
                    title={'Thích'}
                    isActive={comment.liked}
                    onClick={() => handleLikeComment(comment.id)}
                  />
                  <TextButton
                    title={'Trả lời'}
                    onClick={() => {
                      setReplyTo(comment.id);
                      handleToggleReply(comment.id);
                    }}
                  />
                  <span className='text-xs text-gray-500'>{comment.createdAt}</span>
                </div>

                {/* View Replies Link */}
                {comment.replies && comment.replies.length > 0 && (
                  <button
                    onClick={() => handleToggleReply(comment.id)}
                    className='flex items-center space-x-1 mt-2 px-4 text-xs font-semibold text-gray-600 hover:underline'
                  >
                    <span>
                      {comment.showReply
                        ? `↓ Ẩn ${comment.replies.length} phản hồi`
                        : `→ Xem ${comment.replies.length} phản hồi`}
                    </span>
                  </button>
                )}

                {comment.showReply && (
                  <div className='mt-2'>
                    {/* Replies First */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className='ml-10 mb-3 space-y-3'>
                        {comment.replies.map((reply: Reply) => (
                          <div
                            key={reply.id}
                            className='flex items-start space-x-2'
                          >
                            <img
                              src={reply.user.avatar}
                              alt={reply.user.name}
                              className='w-7 h-7 rounded-full'
                            />
                            <div className='flex-1'>
                              <div className='relative inline-block'>
                                <div className='bg-gray-100 rounded-2xl px-3 py-2'>
                                  <h4 className='font-semibold text-xs'>
                                    {reply.user.name}
                                  </h4>
                                  <p className='text-sm'>{reply.content}</p>
                                </div>
                                {/* Like Badge on Reply Bubble */}
                                {reply.likeCounting > 0 && (
                                  <div className='absolute -bottom-2 -right-1 bg-white rounded-full shadow-md px-2 py-0.5 flex items-center space-x-1 border border-gray-200'>
                                    <Heart className='w-3 h-3 text-red-500 fill-red-500' />
                                    <span className='text-xs font-medium text-gray-700'>
                                      {reply.likeCounting}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className='flex items-center space-x-4 mt-2 px-3'>
                                <button
                                  onClick={() =>
                                    handleLikeComment(
                                      reply.id,
                                      true,
                                      comment.id,
                                    )
                                  }
                                  className={`text-xs font-semibold hover:underline transition-colors ${
                                    reply.liked
                                      ? 'text-blue-600'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  Thích
                                </button>
                                <span className='text-xs text-gray-500'>
                                  {reply.createdAt}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <CommentInput value={replyText} onChange={setReplyText} onSubmit={() => handleReply(comment.id)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className='text-gray-500 text-center py-8'>
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </p>
      )}
    </div>
  );
};

export default CommentsList;
