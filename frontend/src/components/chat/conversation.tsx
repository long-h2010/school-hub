import { useAuth } from '../../contexts/auth-context';
import type { Chat } from '../../types/chat';
import UserDisplay from './user-display';

interface Props {
    chat: Chat;
    active: boolean;
    onClick: () => void;
}

const Conversation: React.FC<Props> = ({ chat, active, onClick }) => {
    const { user } = useAuth();

    return (
        <button
            key={chat.id}
            onClick={onClick}
            className={`w-full flex items-center space-x-4 p-4 transition-all ${
                active
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600'
                    : 'hover:bg-gray-50'
            }`}
        >
            <div className='relative flex-shrink-0'>
                <UserDisplay user={chat} />
            </div>
            <div className='flex-1 text-left min-w-0'>
                <div className='flex justify-between items-center mb-1'>
                    <h3 className='font-semibold text-gray-900 truncate'>{chat.displayName}</h3>
                    <span className='text-xs text-gray-500 flex-shrink-0 ml-2'>{chat.time}</span>
                </div>
                <div className='flex justify-between items-center'>
                    <p className='text-sm text-gray-600 truncate'>
                        {chat.lastMessage.sender.id == user._id ? 'Bạn: ' : ''}
                        {chat.lastMessage.message}
                    </p>
                    {chat.unread > 0 && (
                        <span className='bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-2 font-semibold shadow-lg'>
                            {chat.unread}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default Conversation;
