import { useAuth } from '../../../contexts/auth-context';

const CommentInput: React.FC<{
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}> = ({ value, onChange, onSubmit }) => {
  const { user } = useAuth();
  return (
    <div className='flex items-start space-x-2 mb-6'>
      <img src={user.avatar} alt='Avatar' className='w-8 h-8 rounded-full' />
      <div className='flex-1'>
        <div className='bg-gray-100 rounded-2xl px-4 py-2'>
          <input
            type='text'
            placeholder='Viết bình luận...'
            className='w-full bg-transparent outline-none text-sm'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value.trim()) {
                onSubmit();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
