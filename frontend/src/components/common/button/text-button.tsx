import type React from 'react';

interface Props {
  title: string;
  isActive?: boolean;
  onClick: () => void;
}

const TextButton: React.FC<Props> = ({ title, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold hover:underline transition-colors ${
        isActive ? 'text-blue-600' : 'text-gray-600'
      }`}
    >
      {title}
    </button>
  );
};

export default TextButton;
