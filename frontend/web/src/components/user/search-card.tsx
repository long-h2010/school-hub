import type { User } from '../../types/user';

interface Props {
  user: User;
  onClick: () => void;
}

const SearchCard: React.FC<Props> = ({ user, onClick }) => {
  return (
    <button
      key={user.id}
      onClick={onClick}
      className='w-full flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group'
    >
      <div className='relative'>
        <img
          src={user.avatar}
          alt={user.name}
          className='w-12 h-12 rounded-full ring-2 ring-white group-hover:ring-blue-200 transition-all'
        />
      </div>
      <div className='flex-1 text-left min-w-0'>
        <h3 className='font-semibold text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors'>
          {user.name}
        </h3>
      </div>
    </button>
  );
};

export default SearchCard;
