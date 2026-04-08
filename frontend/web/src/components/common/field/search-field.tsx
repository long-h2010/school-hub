import { t } from 'i18next';
import { Search, X } from 'lucide-react';

interface Props {
  width: string;
  rounded?: string;
  focus?: string;
  value: string;
  setValue: (text: string) => void;
}

const SearchField: React.FC<Props> = ({
  width,
  rounded = 'rounded-full',
  focus,
  value,
  setValue,
}) => {
  return (
    <div
      className={`hidden md:flex items-center bg-gray-100 ${rounded} px-4
        ${focus && `focus-within:ring-2 focus-within:${focus}`}`}
    >
      <Search className='w-4 h-4 text-gray-500 mr-2' />
      <input
        type='text'
        placeholder={t('search-placeholder')}
        className={`${width} bg-transparent outline-none border-white`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className='w-8 h-8 flex items-center justify-center flex-shrink-0'>
        {value ? (
          <button
            onClick={() => setValue('')}
            className='p-1 hover:bg-gray-200 rounded-full'
          >
            <X className='w-4 h-4 text-gray-500' />
          </button>
        ) : (
          <div className='w-6 h-6' />
        )}
      </div>
    </div>
  );
};

export default SearchField;
