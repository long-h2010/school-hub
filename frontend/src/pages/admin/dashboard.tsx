import { Users, MessageSquare, FileText, Ban, TrendingUp, BarChart3, Activity } from 'lucide-react';
import {
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
import { StatsCard } from '../../components/admin';

const DashBoard = () => {
    const stats = [
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

    const userGrowthData = [
        { month: 'T1', users: 400 },
        { month: 'T2', users: 520 },
        { month: 'T3', users: 680 },
        { month: 'T4', users: 850 },
        { month: 'T5', users: 920 },
        { month: 'T6', users: 1050 },
        { month: 'T7', users: 1234 },
    ];

    const activityData = [
        { day: 'T2', posts: 45, comments: 120 },
        { day: 'T3', posts: 52, comments: 145 },
        { day: 'T4', posts: 48, comments: 132 },
        { day: 'T5', posts: 61, comments: 168 },
        { day: 'T6', posts: 55, comments: 151 },
        { day: 'T7', posts: 72, comments: 189 },
        { day: 'CN', posts: 89, comments: 220 },
    ];

    const userStatusData = [
        { name: 'Hoạt động', value: 1200, color: '#10b981' },
        { name: 'Hạn chế', value: 22, color: '#f59e0b' },
        { name: 'Bị cấm', value: 12, color: '#ef4444' },
    ];

    return (
        <div className='space-y-6'>
            <StatsCard stats={stats} />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300'>
                    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                        <TrendingUp className='w-5 h-5 text-blue-500' />
                        Tăng trưởng người dùng
                    </h3>
                    <ResponsiveContainer width='100%' height={300}>
                        <AreaChart data={userGrowthData}>
                            <defs>
                                <linearGradient id='colorUsers' x1='0' y1='0' x2='0' y2='1'>
                                    <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                                    <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
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
                                label={({ name, percent }: any) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                fill='#8884d8'
                                dataKey='value'
                            >
                                {userStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
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
    );
};

export default DashBoard;
