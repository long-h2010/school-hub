import { User, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const avatar = user?.avatar || '/default-avatar.png';

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1'
      >
        <img src={avatar} alt='Avatar' className='w-8 h-8 rounded-full' />
      </button>

      {isOpen && (
        <>
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />
          <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-20'>
            <div className='p-4'>
              <div className='flex items-center space-x-3'>
                <img
                  src={avatar}
                  alt='Avatar'
                  className='w-12 h-12 rounded-full'
                />
                <div>
                  <h3 className='font-semibold'>Bạn</h3>
                  <p className='text-sm text-gray-500'>Xem trang cá nhân</p>
                </div>
              </div>
            </div>

            <div className='py-2'>
              <button
                className='w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 text-left'
                onClick={() => navigate('/me')}
              >
                <User className='w-5 h-5 text-gray-600' />
                <span>{t('profile')}</span>
              </button>
              <button className='w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 text-left'>
                <Settings className='w-5 h-5 text-gray-600' />
                <span>{t('setting')}</span>
              </button>
            </div>

            <div className='py-2'>
              <button
                onClick={() => logout()}
                className='w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 text-left text-red-600'
              >
                <LogOut className='w-5 h-5' />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;
