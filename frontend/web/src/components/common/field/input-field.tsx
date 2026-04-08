import { Eye, EyeOff } from 'lucide-react';

interface Props {
  label: string;
  type?: string;
  value: string;
  focusColor?: string;
  bgColor?: string;
  boderColor?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const InputField: React.FC<Props> = ({
  label,
  type = 'text',
  value,
  focusColor,
  bgColor,
  boderColor = 'border-gray-300',
  onChange,
  error,
  placeholder,
  icon: Icon,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
}) => {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
      </label>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Icon className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type={
            showPasswordToggle ? (showPassword ? 'text' : 'password') : type
          }
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-${showPasswordToggle ? '12' : '4'} ${bgColor} 
                    py-3 border rounded-xl focus:ring-2 focus:${focusColor} focus:border-transparent 
                    outline-none transition ${error ? 'border-red-500' : boderColor}`}
          placeholder={placeholder}
        />
        {showPasswordToggle && onTogglePassword && (
          <button
            type='button'
            onClick={onTogglePassword}
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
          >
            {showPassword ? (
              <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            ) : (
              <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            )}
          </button>
        )}
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
};

export default InputField;
