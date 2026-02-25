import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPrevious: () => void;
    onNext: () => void;
}

const Pagination: React.FC<Props> = ({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    onPageChange,
    onPrevious,
    onNext,
}) => {
    return (
        <div className='p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white'>
            <div className='text-sm text-gray-600 font-medium'>
                Hiển thị <span className='font-bold text-gray-900'>{startIndex + 1}</span> -{' '}
                <span className='font-bold text-gray-900'>{Math.min(endIndex, totalItems)}</span>{' '}
                trong tổng số <span className='font-bold text-gray-900'>{totalItems}</span>
            </div>

            <div className='flex items-center gap-2'>
                <button
                    onClick={onPrevious}
                    disabled={currentPage === 1}
                    className={`p-2.5 rounded-xl font-medium transition-all duration-200 ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white shadow-sm hover:shadow-lg'
                    }`}
                >
                    <ChevronLeft className='w-5 h-5' />
                </button>

                <div className='flex items-center gap-1'>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all duration-200 ${
                                        currentPage === page
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                                <span key={page} className='px-2 text-gray-400 font-bold'>
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}
                </div>

                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className={`p-2.5 rounded-xl font-medium transition-all duration-200 ${
                        currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white shadow-sm hover:shadow-lg'
                    }`}
                >
                    <ChevronRight className='w-5 h-5' />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
