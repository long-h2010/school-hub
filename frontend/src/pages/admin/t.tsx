import React, { useState, useEffect } from 'react';
import {
    Users,
    MessageSquare,
    FileText,
    Ban,
    TrendingUp,
    UserX,
    Search,
    Home,
    BarChart3,
    Settings,
    Shield,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Activity,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

// Types
interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'banned' | 'restricted';
    posts: number;
    comments: number;
    joined: string;
    banUntil?: string;
    restriction?: 'comment' | 'post';
}

interface StatCard {
    label: string;
    value: string;
    icon: React.ComponentType<any>;
    color: string;
    change: string;
    bgGradient: string;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
}

interface ChartData {
    month?: string;
    day?: string;
    users?: number;
    posts?: number;
    comments?: number;
}

interface PieData {
    name: string;
    value: number;
    color: string;
}

// Sidebar Component
const Sidebar: React.FC<{
    activeTab: string;
    setActiveTab: (tab: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}> = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
    const menuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Tổng quan', icon: Home },
        { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
        { id: 'users', label: 'Người dùng', icon: Users },
        { id: 'moderation', label: 'Kiểm duyệt', icon: Shield },
        { id: 'settings', label: 'Cài đặt', icon: Settings },
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div className='flex items-center justify-between p-6 border-b border-gray-700/50'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                        <Activity className='w-6 h-6' />
                    </div>
                    <div>
                        <h2 className='text-xl font-bold'>SocialHub</h2>
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
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                            activeTab === item.id
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                        }`}
                    >
                        <item.icon className='w-5 h-5' />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur'>
                <div className='flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition cursor-pointer'>
                    <div className='w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg shadow-lg'>
                        A
                    </div>
                    <div className='flex-1'>
                        <p className='font-semibold text-sm'>Admin User</p>
                        <p className='text-xs text-gray-400'>admin@socialhub.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

// Header Component
const Header: React.FC<{
    activeTab: string;
    setSidebarOpen: (open: boolean) => void;
}> = ({ activeTab, setSidebarOpen }) => {
    const menuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Tổng quan', icon: Home },
        { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
        { id: 'users', label: 'Người dùng', icon: Users },
        { id: 'moderation', label: 'Kiểm duyệt', icon: Shield },
        { id: 'settings', label: 'Cài đặt', icon: Settings },
    ];

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
                                {menuItems.find((item) => item.id === activeTab)?.label}
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
                            <AlertCircle className='w-5 h-5 text-gray-600' />
                            <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

// Enhanced Stats Cards Component
const StatsCards: React.FC<{ stats: StatCard[] }> = ({ stats }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className='group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden'
                >
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    ></div>
                    <div className='relative p-6'>
                        <div className='flex items-center justify-between mb-4'>
                            <div
                                className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-lg`}
                            >
                                <stat.icon className='w-6 h-6 text-white' />
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    stat.change.startsWith('+')
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {stat.change}
                            </span>
                        </div>
                        <p className='text-sm text-gray-600 mb-1 font-medium'>{stat.label}</p>
                        <p className='text-3xl font-bold text-gray-900'>{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Enhanced User Table Component
const UserTable: React.FC<{
    users: User[];
    onBanClick: (user: User) => void;
    onUnbanClick: (user: User) => void;
}> = ({ users, onBanClick, onUnbanClick }) => {
    return (
        <div className='overflow-x-auto'>
            <table className='w-full'>
                <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
                    <tr>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                            Người dùng
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                            Email
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                            Trạng thái
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                            Bài viết
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                            Bình luận
                        </th>
                        <th className='text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider'>
                            Hành động
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className='hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200'
                        >
                            <td className='py-4 px-6'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg'>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className='font-semibold text-gray-900'>{user.name}</p>
                                        <p className='text-xs text-gray-500 flex items-center gap-1'>
                                            <Clock className='w-3 h-3' />
                                            {user.joined}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className='py-4 px-6 text-gray-600 font-medium'>{user.email}</td>
                            <td className='py-4 px-6'>
                                {user.status === 'active' && (
                                    <span className='px-3 py-1.5 bg-gradient-to-r from-green-100 to-green-50 text-green-700 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit'>
                                        <CheckCircle2 className='w-3.5 h-3.5' />
                                        Hoạt động
                                    </span>
                                )}
                                {user.status === 'banned' && (
                                    <span className='px-3 py-1.5 bg-gradient-to-r from-red-100 to-red-50 text-red-700 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit'>
                                        <XCircle className='w-3.5 h-3.5' />
                                        Đã cấm
                                    </span>
                                )}
                                {user.status === 'restricted' && (
                                    <span className='px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit'>
                                        <AlertCircle className='w-3.5 h-3.5' />
                                        Hạn chế
                                    </span>
                                )}
                            </td>
                            <td className='py-4 px-6'>
                                <span className='text-gray-900 font-bold'>{user.posts}</span>
                            </td>
                            <td className='py-4 px-6'>
                                <span className='text-gray-900 font-bold'>{user.comments}</span>
                            </td>
                            <td className='py-4 px-6'>
                                {user.status === 'active' || user.status === 'restricted' ? (
                                    <button
                                        onClick={() => onBanClick(user)}
                                        className='px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105'
                                    >
                                        Cấm/Hạn chế
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onUnbanClick(user)}
                                        className='px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-105'
                                    >
                                        Gỡ cấm
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Enhanced Pagination Component
const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPrevious: () => void;
    onNext: () => void;
}> = ({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    onPageChange,
    onPrevious,
    onNext,
}) => {
    return (
        <div className='p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white'>
            <div className='text-sm text-gray-600 font-medium'>
                Hiển thị <span className='font-bold text-gray-900'>{startIndex + 1}</span> -{' '}
                <span className='font-bold text-gray-900'>{Math.min(endIndex, totalItems)}</span>{' '}
                trong tổng số <span className='font-bold text-gray-900'>{totalItems}</span> người
                dùng
            </div>

            <div className='flex items-center gap-2'>
                <button
                    onClick={onPrevious}
                    disabled={currentPage === 1}
                    className={`p-2.5 rounded-xl font-medium transition-all duration-200 ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white shadow-sm hover:shadow-lg'
                    }`}
                >
                    <ChevronLeft className='w-5 h-5' />
                </button>

                <div className='flex items-center gap-1'>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all duration-200 ${
                                        currentPage === page
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                                <span key={page} className='px-2 text-gray-400 font-bold'>
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}
                </div>

                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className={`p-2.5 rounded-xl font-medium transition-all duration-200 ${
                        currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white shadow-sm hover:shadow-lg'
                    }`}
                >
                    <ChevronRight className='w-5 h-5' />
                </button>
            </div>
        </div>
    );
};

// Enhanced Ban Modal Component
const BanModal: React.FC<{
    user: User | null;
    banType: string;
    banDuration: string;
    onClose: () => void;
    onBanTypeChange: (type: string) => void;
    onDurationChange: (duration: string) => void;
    onConfirm: () => void;
}> = ({ user, banType, banDuration, onClose, onBanTypeChange, onDurationChange, onConfirm }) => {
    if (!user) return null;

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200'>
            <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in duration-200'>
                <div className='p-6 border-b border-gray-100'>
                    <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30'>
                            <UserX className='w-7 h-7 text-white' />
                        </div>
                        <div>
                            <h3 className='text-xl font-bold text-gray-900'>
                                Cấm/Hạn chế người dùng
                            </h3>
                            <p className='text-sm text-gray-600 mt-1'>{user.name}</p>
                        </div>
                    </div>
                </div>

                <div className='p-6 space-y-5'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            Loại hạn chế
                        </label>
                        <select
                            value={banType}
                            onChange={(e) => onBanTypeChange(e.target.value)}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium'
                        >
                            <option value='all'>🚫 Cấm hoàn toàn</option>
                            <option value='post'>📝 Cấm đăng bài</option>
                            <option value='comment'>💬 Cấm bình luận</option>
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            Thời gian
                        </label>
                        <select
                            value={banDuration}
                            onChange={(e) => onDurationChange(e.target.value)}
                            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium'
                        >
                            <option value='1'>1 ngày</option>
                            <option value='3'>3 ngày</option>
                            <option value='7'>7 ngày</option>
                            <option value='14'>14 ngày</option>
                            <option value='30'>30 ngày</option>
                            <option value='permanent'>⏰ Vĩnh viễn</option>
                        </select>
                    </div>

                    <div className='flex gap-3 pt-2'>
                        <button
                            onClick={onClose}
                            className='flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200'
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            className='flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105'
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Dashboard Component
const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('dashboard');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [banDuration, setBanDuration] = useState<string>('7');
    const [banType, setBanType] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);

    const users: User[] = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'vana@email.com',
            status: 'active',
            posts: 45,
            comments: 120,
            joined: '2024-01-15',
        },
        {
            id: 2,
            name: 'Trần Thị B',
            email: 'thib@email.com',
            status: 'active',
            posts: 32,
            comments: 89,
            joined: '2024-02-20',
        },
        {
            id: 3,
            name: 'Lê Văn C',
            email: 'vanc@email.com',
            status: 'banned',
            posts: 12,
            comments: 45,
            joined: '2024-03-10',
            banUntil: '2024-12-10',
        },
        {
            id: 4,
            name: 'Phạm Thị D',
            email: 'thid@email.com',
            status: 'active',
            posts: 67,
            comments: 234,
            joined: '2023-12-05',
        },
        {
            id: 5,
            name: 'Hoàng Văn E',
            email: 'vane@email.com',
            status: 'restricted',
            posts: 8,
            comments: 23,
            joined: '2024-05-18',
            restriction: 'comment',
        },
        {
            id: 6,
            name: 'Đỗ Thị F',
            email: 'thif@email.com',
            status: 'active',
            posts: 54,
            comments: 167,
            joined: '2024-04-12',
        },
        {
            id: 7,
            name: 'Vũ Văn G',
            email: 'vang@email.com',
            status: 'active',
            posts: 23,
            comments: 78,
            joined: '2024-06-08',
        },
        {
            id: 8,
            name: 'Mai Thị H',
            email: 'thih@email.com',
            status: 'restricted',
            posts: 15,
            comments: 34,
            joined: '2024-07-22',
            restriction: 'post',
        },
        {
            id: 9,
            name: 'Bùi Văn I',
            email: 'vani@email.com',
            status: 'active',
            posts: 89,
            comments: 312,
            joined: '2023-11-30',
        },
        {
            id: 10,
            name: 'Đinh Thị K',
            email: 'thik@email.com',
            status: 'active',
            posts: 41,
            comments: 156,
            joined: '2024-03-25',
        },
        {
            id: 11,
            name: 'Dương Văn L',
            email: 'vanl@email.com',
            status: 'banned',
            posts: 6,
            comments: 18,
            joined: '2024-08-14',
            banUntil: '2024-12-15',
        },
        {
            id: 12,
            name: 'Cao Thị M',
            email: 'thim@email.com',
            status: 'active',
            posts: 72,
            comments: 245,
            joined: '2024-01-08',
        },
        {
            id: 13,
            name: 'Từ Văn N',
            email: 'vann@email.com',
            status: 'active',
            posts: 38,
            comments: 94,
            joined: '2024-05-03',
        },
        {
            id: 14,
            name: 'Lương Thị O',
            email: 'thio@email.com',
            status: 'active',
            posts: 61,
            comments: 189,
            joined: '2024-02-17',
        },
        {
            id: 15,
            name: 'Tô Văn P',
            email: 'vanp@email.com',
            status: 'restricted',
            posts: 11,
            comments: 27,
            joined: '2024-09-05',
            restriction: 'comment',
        },
    ];

    const stats: StatCard[] = [
        {
            label: 'Tổng người dùng',
            value: '1,234',
            icon: Users,
            color: 'bg-blue-500',
            change: '+12%',
            bgGradient: 'from-blue-500 to-blue-600',
        },
        {
            label: 'Bài viết hôm nay',
            value: '89',
            icon: FileText,
            color: 'bg-green-500',
            change: '+8%',
            bgGradient: 'from-green-500 to-green-600',
        },
        {
            label: 'Bình luận hôm nay',
            value: '456',
            icon: MessageSquare,
            color: 'bg-purple-500',
            change: '+15%',
            bgGradient: 'from-purple-500 to-purple-600',
        },
        {
            label: 'Người dùng bị chặn',
            value: '12',
            icon: Ban,
            color: 'bg-red-500',
            change: '-3%',
            bgGradient: 'from-red-500 to-red-600',
        },
    ];

    const userGrowthData: ChartData[] = [
        { month: 'T1', users: 400 },
        { month: 'T2', users: 520 },
        { month: 'T3', users: 680 },
        { month: 'T4', users: 850 },
        { month: 'T5', users: 920 },
        { month: 'T6', users: 1050 },
        { month: 'T7', users: 1234 },
    ];

    const activityData: ChartData[] = [
        { day: 'T2', posts: 45, comments: 120 },
        { day: 'T3', posts: 52, comments: 145 },
        { day: 'T4', posts: 48, comments: 132 },
        { day: 'T5', posts: 61, comments: 168 },
        { day: 'T6', posts: 55, comments: 151 },
        { day: 'T7', posts: 72, comments: 189 },
        { day: 'CN', posts: 89, comments: 220 },
    ];

    const userStatusData: PieData[] = [
        { name: 'Hoạt động', value: 1200, color: '#10b981' },
        { name: 'Hạn chế', value: 22, color: '#f59e0b' },
        { name: 'Bị cấm', value: 12, color: '#ef4444' },
    ];

    const handleBanUser = (user: User, type: string, duration: string) => {
        alert(
            `Đã ${type === 'all' ? 'cấm' : 'hạn chế ' + type} tài khoản ${
                user.name
            } trong ${duration} ngày`
        );
        setSelectedUser(null);
    };

    const handleUnban = (user: User) => {
        alert(`Đã gỡ cấm tài khoản ${user.name}`);
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex'>
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {sidebarOpen && (
                <div
                    className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200'
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className='flex-1 flex flex-col min-h-screen'>
                <Header activeTab={activeTab} setSidebarOpen={setSidebarOpen} />

                <main className='flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto'>
                    {activeTab === 'dashboard' && (
                        <div className='space-y-6'>
                            <StatsCards stats={stats} />

                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300'>
                                    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                                        <TrendingUp className='w-5 h-5 text-blue-500' />
                                        Tăng trưởng người dùng
                                    </h3>
                                    <ResponsiveContainer width='100%' height={300}>
                                        <AreaChart data={userGrowthData}>
                                            <defs>
                                                <linearGradient
                                                    id='colorUsers'
                                                    x1='0'
                                                    y1='0'
                                                    x2='0'
                                                    y2='1'
                                                >
                                                    <stop
                                                        offset='5%'
                                                        stopColor='#3b82f6'
                                                        stopOpacity={0.3}
                                                    />
                                                    <stop
                                                        offset='95%'
                                                        stopColor='#3b82f6'
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                                            <XAxis dataKey='month' stroke='#6b7280' />
                                            <YAxis stroke='#6b7280' />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                                }}
                                            />
                                            <Area
                                                type='monotone'
                                                dataKey='users'
                                                stroke='#3b82f6'
                                                strokeWidth={3}
                                                fill='url(#colorUsers)'
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300'>
                                    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                                        <Activity className='w-5 h-5 text-purple-500' />
                                        Trạng thái người dùng
                                    </h3>
                                    <ResponsiveContainer width='100%' height={300}>
                                        <PieChart>
                                            <Pie
                                                data={userStatusData}
                                                cx='50%'
                                                cy='50%'
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name} ${(percent * 100).toFixed(0)}%`
                                                }
                                                outerRadius={100}
                                                fill='#8884d8'
                                                dataKey='value'
                                            >
                                                {userStatusData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300'>
                                <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                                    <BarChart3 className='w-5 h-5 text-green-500' />
                                    Hoạt động 7 ngày qua
                                </h3>
                                <ResponsiveContainer width='100%' height={300}>
                                    <BarChart data={activityData}>
                                        <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                                        <XAxis dataKey='day' stroke='#6b7280' />
                                        <YAxis stroke='#6b7280' />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey='posts'
                                            fill='#10b981'
                                            name='Bài viết'
                                            radius={[12, 12, 0, 0]}
                                        />
                                        <Bar
                                            dataKey='comments'
                                            fill='#8b5cf6'
                                            name='Bình luận'
                                            radius={[12, 12, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className='space-y-6'>
                            <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6'>
                                <h3 className='text-lg font-bold text-gray-900 mb-6'>
                                    Phân tích chi tiết
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                                    <div className='p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50'>
                                        <p className='text-sm text-blue-700 font-semibold mb-2'>
                                            Tỷ lệ tương tác
                                        </p>
                                        <p className='text-3xl font-bold text-blue-900'>37.5%</p>
                                    </div>
                                    <div className='p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200/50'>
                                        <p className='text-sm text-green-700 font-semibold mb-2'>
                                            Trung bình bài viết/ngày
                                        </p>
                                        <p className='text-3xl font-bold text-green-900'>58</p>
                                    </div>
                                    <div className='p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50'>
                                        <p className='text-sm text-purple-700 font-semibold mb-2'>
                                            Người dùng hoạt động
                                        </p>
                                        <p className='text-3xl font-bold text-purple-900'>892</p>
                                    </div>
                                </div>
                                <ResponsiveContainer width='100%' height={400}>
                                    <LineChart data={activityData}>
                                        <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                                        <XAxis dataKey='day' stroke='#6b7280' />
                                        <YAxis stroke='#6b7280' />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type='monotone'
                                            dataKey='posts'
                                            stroke='#10b981'
                                            strokeWidth={3}
                                            name='Bài viết'
                                            dot={{ r: 5, fill: '#10b981' }}
                                        />
                                        <Line
                                            type='monotone'
                                            dataKey='comments'
                                            stroke='#8b5cf6'
                                            strokeWidth={3}
                                            name='Bình luận'
                                            dot={{ r: 5, fill: '#8b5cf6' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden'>
                            <div className='p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50'>
                                <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
                                    <div className='relative flex-1 w-full'>
                                        <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                                        <input
                                            type='text'
                                            placeholder='Tìm kiếm người dùng...'
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className='w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium'
                                        />
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-sm text-gray-600 font-semibold whitespace-nowrap'>
                                            Hiển thị:
                                        </span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className='px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold'
                                        >
                                            <option value='5'>5</option>
                                            <option value='10'>10</option>
                                            <option value='15'>15</option>
                                            <option value='20'>20</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <UserTable
                                users={currentUsers}
                                onBanClick={setSelectedUser}
                                onUnbanClick={handleUnban}
                            />

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                startIndex={startIndex}
                                endIndex={endIndex}
                                totalItems={filteredUsers.length}
                                onPageChange={setCurrentPage}
                                onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                onNext={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                            />
                        </div>
                    )}

                    {activeTab === 'moderation' && (
                        <div className='space-y-6'>
                            <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6'>
                                <h3 className='text-lg font-bold text-gray-900 mb-6 flex items-center gap-2'>
                                    <Shield className='w-6 h-6 text-orange-500' />
                                    Báo cáo gần đây
                                </h3>
                                <div className='space-y-4'>
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className='flex items-center justify-between p-5 border-2 border-gray-100 rounded-xl hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-200'
                                        >
                                            <div className='flex items-center gap-4'>
                                                <div className='w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center'>
                                                    <Shield className='w-7 h-7 text-orange-600' />
                                                </div>
                                                <div>
                                                    <p className='font-bold text-gray-900'>
                                                        Nội dung vi phạm #{i}
                                                    </p>
                                                    <p className='text-sm text-gray-600 mt-1'>
                                                        Báo cáo bởi 3 người dùng
                                                    </p>
                                                </div>
                                            </div>
                                            <button className='px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105'>
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6'>
                            <h3 className='text-lg font-bold text-gray-900 mb-6 flex items-center gap-2'>
                                <Settings className='w-6 h-6 text-gray-600' />
                                Cài đặt hệ thống
                            </h3>
                            <div className='space-y-6'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        Thời gian cấm mặc định
                                    </label>
                                    <select className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium'>
                                        <option>7 ngày</option>
                                        <option>14 ngày</option>
                                        <option>30 ngày</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                                        Tự động kiểm duyệt
                                    </label>
                                    <div className='flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100'>
                                        <input
                                            type='checkbox'
                                            className='w-5 h-5 text-blue-600 rounded border-2 border-gray-300'
                                        />
                                        <span className='ml-3 text-gray-900 font-medium'>
                                            Bật kiểm duyệt tự động
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <BanModal
                user={selectedUser}
                banType={banType}
                banDuration={banDuration}
                onClose={() => setSelectedUser(null)}
                onBanTypeChange={setBanType}
                onDurationChange={setBanDuration}
                onConfirm={() => selectedUser && handleBanUser(selectedUser, banType, banDuration)}
            />
        </div>
    );
};

export default AdminDashboard;
