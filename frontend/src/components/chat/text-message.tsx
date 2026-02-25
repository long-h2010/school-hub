import type { Ref } from 'react';
import { useAuth } from '../../contexts/auth-context';
import type { Chat, Message } from '../../types/chat';

interface Props {
    messages: Message[];
    chat: Chat;
    ref: Ref<HTMLDivElement | null>;
}

const TextMessage: React.FC<Props> = ({ messages, chat, ref }) => {
    const { user } = useAuth();
    const currentUserId = user?._id;

    return (
        <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white'>
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${
                        message.user.id === currentUserId ? 'justify-end' : 'justify-start'
                    }`}
                >
                    <div
                        className={`flex items-end space-x-2 max-w-md ${
                            message.user.id === currentUserId
                                ? 'flex-row-reverse space-x-reverse'
                                : ''
                        }`}
                    >
                        {message.user.id !== currentUserId && (
                            <img
                                src={message.user.avatar}
                                alt='avatar'
                                className='w-8 h-8 rounded-full flex-shrink-0'
                            />
                        )}
                        <div>
                            {chat.isGroup && message.user.id !== currentUserId && (
                                <p className='text-xs text-gray-500 mb-1 px-2'>
                                    {message.user.name}
                                </p>
                            )}
                            <div
                                className={`px-5 py-3 rounded-3xl shadow-md ${
                                    message.user.id === currentUserId
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 rounded-bl-none'
                                }`}
                            >
                                <p className='text-sm leading-relaxed'>{message.content}</p>
                            </div>
                            <span
                                className={`text-xs text-gray-400 mt-1 block ${
                                    message.user.id === currentUserId ? 'text-right' : 'text-left'
                                }`}
                            >
                                {message.time}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
            
            <div ref={ref} />
        </div>
    );
};

export default TextMessage;
