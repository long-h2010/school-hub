const SkeletonLoading: React.FC = () => {
    return (
        <>
            <div className='flex justify-start'>
                <div className='flex items-end space-x-2 max-w-md'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0'></div>
                    <div>
                        <div className='bg-gray-200 rounded-3xl rounded-bl-none px-5 py-3 w-64 h-16 animate-pulse'></div>
                        <div className='bg-gray-200 rounded w-12 h-3 mt-1 animate-pulse'></div>
                    </div>
                </div>
            </div>

            <div className='flex justify-end'>
                <div className='flex items-end space-x-2 max-w-md flex-row-reverse space-x-reverse'>
                    <div>
                        <div className='bg-gray-200 rounded-3xl rounded-br-none px-5 py-3 w-48 h-14 animate-pulse'></div>
                        <div className='bg-gray-200 rounded w-12 h-3 mt-1 ml-auto animate-pulse'></div>
                    </div>
                </div>
            </div>

            <div className='flex justify-start'>
                <div className='flex items-end space-x-2 max-w-md'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0'></div>
                    <div>
                        <div className='bg-gray-200 rounded-3xl rounded-bl-none px-5 py-3 w-56 h-12 animate-pulse'></div>
                        <div className='bg-gray-200 rounded w-12 h-3 mt-1 animate-pulse'></div>
                    </div>
                </div>
            </div>

            <div className='flex justify-end'>
                <div className='flex items-end space-x-2 max-w-md flex-row-reverse space-x-reverse'>
                    <div>
                        <div className='bg-gray-200 rounded-3xl rounded-br-none px-5 py-3 w-72 h-20 animate-pulse'></div>
                        <div className='bg-gray-200 rounded w-12 h-3 mt-1 ml-auto animate-pulse'></div>
                    </div>
                </div>
            </div>

            <div className='flex justify-start'>
                <div className='flex items-end space-x-2 max-w-md'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0'></div>
                    <div>
                        <div className='bg-gray-200 rounded-3xl rounded-bl-none px-5 py-3 w-44 h-14 animate-pulse'></div>
                        <div className='bg-gray-200 rounded w-12 h-3 mt-1 animate-pulse'></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SkeletonLoading;
