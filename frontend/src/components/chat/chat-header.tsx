import { Users, Video, MoreHorizontal } from 'lucide-react';
import type { Chat } from '../../types/chat';
import UserDisplay from './user-display';
import { t } from 'i18next';

interface Props {
  chat: Chat;
}

const ChatHeader: React.FC<Props> = ({ chat }) => {
  return (
    <div className='p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <UserDisplay user={chat} />
          <div>
            <h3 className='font-bold text-white text-lg'>{chat.displayName}</h3>
            <p className='text-xs text-blue-100 flex items-center space-x-1'>
              {chat.isGroup ? (
                <span>{t('group-members', { members: chat.memberCount })}</span>
              ) : chat.online ? (
                <>
                  <span className='animate-pulse'>{t('user-online')}</span>
                </>
              ) : (
                <span>{t('user-offline')}</span>
              )}
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <button className='p-3 hover:bg-white/20 rounded-full transition-all'>
            <Video className='w-6 h-6 text-white' />
          </button>
          {chat.isGroup && (
            <button className='p-3 hover:bg-white/20 rounded-full transition-all'>
              <Users className='w-6 h-6 text-white' />
            </button>
          )}
          <button className='p-3 hover:bg-white/20 rounded-full transition-all'>
            <MoreHorizontal className='w-6 h-6 text-white' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
