import { Bell, Users, Send, X } from 'lucide-react';
import type React from 'react';

interface Props {
    setMenuOpen: (open: boolean) => void ;
}

const PostMenu: React.FC<Props> = ({ setMenuOpen}) => {
    return (
        <>
            <div className='fixed inset-0 z-10' onClick={() => setMenuOpen(false)} />
            <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-20'>
                <button className='w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 text-left'>
                    <Bell className='w-5 h-5 text-gray-600' />
                    <div>
                        <p className='font-medium text-sm'>Bật thông báo</p>
                        <p className='text-xs text-gray-500'>Nhận thông báo về bài viết này</p>
                    </div>
                </button>
                <button className='w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 text-left'>
                    <Users className='w-5 h-5 text-gray-600' />
                    <div>
                        <p className='font-medium text-sm'>Theo dõi</p>
                        <p className='text-xs text-gray-500'>Theo dõi tác giả</p>
                    </div>
                </button>
                <button className='w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 text-left'>
                    <Send className='w-5 h-5 text-gray-600' />
                    <div>
                        <p className='font-medium text-sm'>Gửi tin nhắn</p>
                        <p className='text-xs text-gray-500'>Nhắn tin cho tác giả</p>
                    </div>
                </button>
                <div className='border-t'>
                    <button className='w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 text-left text-red-600'>
                        <X className='w-5 h-5' />
                        <div>
                            <p className='font-medium text-sm'>Báo cáo bài viết</p>
                            <p className='text-xs text-red-400'>Vi phạm quy định</p>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
};

export default PostMenu;
