import type React from 'react';

interface Props {
    active: boolean;
    title: string;
    color: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const ActiveButton: React.FC<Props> = ({ active, title, color, icon, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                active ? color : 'hover:bg-gray-100 text-gray-700'
            }`}
        >
            {icon}
            <span className='font-medium'>{title}</span>
        </button>
    );
};

export default ActiveButton;
