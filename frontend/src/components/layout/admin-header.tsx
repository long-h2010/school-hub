import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { menuItems } from '../../utils/admin-menu';

interface Props {
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader: React.FC<Props> = ({ setSidebarOpen }) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className='bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-30'>
      <div className='px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition'
            >
              <Menu className='w-6 h-6' />
            </button>
            <div>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
                {path == '/admin'
                  ? menuItems[0].label
                  : menuItems.find((item) => path == `/admin/${item.id}`)
                      ?.label}
              </h1>
              <p className='text-sm text-gray-500 mt-0.5'>
                {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <button className='p-2.5 hover:bg-gray-100 rounded-xl transition relative'>
              <Bell className='w-5 h-5 text-gray-600' />
              <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
