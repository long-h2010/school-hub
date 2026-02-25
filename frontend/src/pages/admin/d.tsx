import React, { useState, useEffect } from 'react';
import {
    UserX,
} from 'lucide-react';

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




// Enhanced Stats Cards Component


// Enhanced User Table Component




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
                    {activeTab === 'analytics' && (
                        
                    )}

                    {activeTab === 'users' && (
                        
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
