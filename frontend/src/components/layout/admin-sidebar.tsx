import { X, Activity } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { menuItems } from '../../utils/admin-menu';

interface Props {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<Props> = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white transform transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
        >
            <div className='flex items-center justify-between p-6 border-b border-gray-700/50'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                        <Activity className='w-6 h-6' />
                    </div>
                    <div>
                        <h2 className='text-xl font-bold'>DTUHub</h2>
                        <p className='text-xs text-gray-400'>Admin Panel</p>
                    </div>
                </div>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className='lg:hidden p-2 hover:bg-gray-800 rounded-lg transition'
                >
                    <X className='w-5 h-5' />
                </button>
            </div>

            <nav className='p-4 space-y-2'>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.id == 'dashboard' ? '/admin' : `/admin/${item.id}`}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                            }`
                        }
                        end={item.id === 'dashboard'}
                    >
                        <item.icon className='w-5 h-5' />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur'>
                <div className='flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition cursor-pointer'>
                    <div className='w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg shadow-lg'>
                        A
                    </div>
                    <div className='flex-1'>
                        <p className='font-semibold text-sm'>Admin</p>
                        <p className='text-xs text-gray-400'>admin@dtuhub.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
