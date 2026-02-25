import { Video, Smile, Image } from 'lucide-react';
import React from 'react';

interface Props {
    avatar: string;
    onClick: () => void;
}

const CreatePostButton: React.FC<Props> = ({ avatar, onClick }) => {
    return (
        <div className='bg-white rounded-lg shadow mb-4 p-4'>
            <div className='flex items-center space-x-3'>
                <img
                    src={avatar || '/default-avatar.png'}
                    alt='Avatar'
                    className='w-10 h-10 rounded-full'
                />
                <button
                    onClick={onClick}
                    className='flex-1 bg-gray-100 rounded-full px-4 py-2 text-left text-gray-500 hover:bg-gray-200'
                >
                    Bạn đang nghĩ gì?
                </button>
                <button className='p-2 hover:bg-gray-100 rounded-full'>
                    <Video className='w-6 h-6 text-red-500' />
                </button>
                <button className='p-2 hover:bg-gray-100 rounded-full'>
                    <Image className='w-6 h-6 text-green-500' />
                </button>
                <button className='p-2 hover:bg-gray-100 rounded-full'>
                    <Smile className='w-6 h-6 text-yellow-500' />
                </button>
            </div>
        </div>
    );
};

export default CreatePostButton;
