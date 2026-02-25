import React from 'react';
import { Home, ArrowLeft, SearchX } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className='min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden'>
            <div className='absolute inset-0 opacity-5'>
                <div
                    className='absolute inset-0'
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                ></div>
            </div>

            <div className='relative z-10 max-w-2xl mx-auto text-center'>
                <div className='mb-8'>
                    <h1 className='text-[100px] md:text-[120px] font-bold leading-none tracking-tighter'>
                        <span className='bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent'>
                            404
                        </span>
                    </h1>
                </div>
                
                <div className='mb-8 flex justify-center'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-50'></div>
                        <div className='relative bg-blue-50 rounded-full p-6'>
                            <SearchX size={48} className='text-blue-600' strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <div className='mb-12 space-y-3'>
                    <h2 className='text-2xl md:text-3xl font-bold text-gray-900 tracking-tight'>
                        Không tìm thấy trang
                    </h2>
                    <p className='text-sm md:text-lg text-gray-500 max-w-md mx-auto leading-relaxed'>
                        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển
                    </p>
                </div>

                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                    <button
                        onClick={() => window.history.back()}
                        className='group flex items-center justify-center gap-3 px-8 py-4 border-2 border-blue-200 hover:border-blue-600 text-blue-600 hover:text-blue-700 rounded-full transition-all duration-300 font-medium min-w-[160px]'
                    >
                        <ArrowLeft
                            size={20}
                            className='group-hover:-translate-x-1 transition-transform duration-300'
                        />
                        Quay lại
                    </button>
                    <button
                        onClick={() => (window.location.href = '/')}
                        className='group flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-xl min-w-[160px]'
                    >
                        <Home
                            size={20}
                            className='group-hover:scale-110 transition-transform duration-300'
                        />
                        Trang chủ
                    </button>
                </div>

                <div className='mt-16 flex items-center justify-center gap-2'>
                    <div className='w-1 h-1 bg-gray-300 rounded-full'></div>
                    <div className='w-12 h-0.5 bg-gray-200'></div>
                    <div className='w-1 h-1 bg-gray-300 rounded-full'></div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
