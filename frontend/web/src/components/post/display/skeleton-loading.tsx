const SkeletonCard = () => (
  <div className='bg-white rounded-2xl p-4 mb-4 shadow-sm animate-pulse'>
    <div className='flex items-center gap-3 mb-4'>
      <div className='w-10 h-10 rounded-full bg-gray-200' />
      <div className='flex-1'>
        <div className='h-3.5 w-32 bg-gray-200 rounded-full mb-2' />
        <div className='h-3 w-20 bg-gray-100 rounded-full' />
      </div>
    </div>
    <div className='space-y-2 mb-4'>
      <div className='h-3 w-full bg-gray-200 rounded-full' />
      <div className='h-3 w-5/6 bg-gray-200 rounded-full' />
      <div className='h-3 w-4/6 bg-gray-100 rounded-full' />
    </div>
    <div className='h-48 w-full bg-gray-100 rounded-xl mb-4' />
    {/* Actions */}
    <div className='flex gap-4'>
      <div className='h-3 w-12 bg-gray-200 rounded-full' />
      <div className='h-3 w-12 bg-gray-200 rounded-full' />
    </div>
  </div>
);

const SkeletonLoading = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </>
);

export default SkeletonLoading;
