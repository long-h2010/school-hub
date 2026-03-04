const SpinnerLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`}
    ></div>
  );
};

const Loading: React.FC<{ message?: string }> = ({
  message = 'Đang tải...',
}) => {
  return (
    <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm'>
      <div className='rounded-lg p-8 flex flex-col items-center space-y-4 shadow-2xl'>
        <SpinnerLoading size='lg' />
        <p className='text-gray-700 font-medium text-lg'>{message}</p>
      </div>
    </div>
  );
};

export default Loading;
