import { Users } from 'lucide-react';
import type { Chat } from '../../types/chat';

interface Props {
  user: Chat;
}

const UserDisplay: React.FC<Props> = ({ user }) => {
  return (
    <div className='relative'>
      {user.displayAvatar ? (
        <img
          src={user.displayAvatar}
          alt={user.displayName}
          className='w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md bg-white'
        />
      ) : (
        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-white shadow-md'>
          <Users className='w-8 h-8 text-white' />
        </div>
      )}
      {user.isGroup ? (
        <div className='absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-0.5 shadow-md border border-gray-200'>
          <span className='text-xs font-semibold text-gray-700'>
            {user.memberCount}
          </span>
        </div>
      ) : (
        user.online && (
          <div className='absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-3 border-white rounded-full'></div>
        )
      )}
    </div>
  );
};

export default UserDisplay;
