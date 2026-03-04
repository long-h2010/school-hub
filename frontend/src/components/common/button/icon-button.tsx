interface Props {
  icon: React.ElementType;
  active?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

const IconButton: React.FC<Props> = ({ icon, active, hover, onClick }) => {
  const Icon = icon;

  return (
    <button
      onClick={onClick}
      className={`p-2 group rounded-lg transition-colors ${
        active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
      }`}
    >
      <Icon className={`w-6 h-6 ${hover ? 'group-hover:text-blue-600' : ''}`} />
    </button>
  );
};

export default IconButton;
