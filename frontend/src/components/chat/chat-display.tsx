import { Smile, Send, Image } from 'lucide-react';
import ChatHeader from './chat-header';
import TextMessage from './text-message';
import type { Chat, Message } from '../../types/chat';
import type { Ref } from 'react';
import SkeletonLoading from './skeleton-loading';

interface Props {
  chat: Chat;
  loading: boolean;
  messages: Message[];
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: (id: string) => void;
  ref: Ref<HTMLDivElement | null>;
}

const ChatDisplay: React.FC<Props> = ({
  chat,
  loading,
  messages,
  messageInput,
  setMessageInput,
  handleSendMessage,
  ref,
}) => {
  return (
    <div className='flex-1 flex flex-col bg-white'>
      <ChatHeader chat={chat} />

      {loading ? (
        <SkeletonLoading />
      ) : (
        <TextMessage messages={messages} chat={chat} ref={ref} />
      )}

      <div className='p-6 border-t border-gray-200 bg-white'>
        <div className='flex items-center space-x-3'>
          <button className='p-3 hover:bg-blue-50 rounded-full transition-all group'>
            <Image className='w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors' />
          </button>
          <div className='flex-1 relative'>
            <input
              type='text'
              placeholder='Nhập tin nhắn...'
              className='w-full bg-gray-100 rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-12'
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && messageInput && handleSendMessage(chat.id)
              }
            />
            <button className='absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 rounded-full transition-all'>
              <Smile className='w-5 h-5 text-gray-400' />
            </button>
          </div>
          <button
            onClick={() => handleSendMessage(chat.id)}
            disabled={!messageInput.trim()}
            className={`p-4 rounded-full transition-all shadow-lg ${
              messageInput.trim()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105'
                : 'bg-gray-200'
            }`}
          >
            <Send
              className={`w-5 h-5 ${
                messageInput.trim() ? 'text-white' : 'text-gray-400'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDisplay;
