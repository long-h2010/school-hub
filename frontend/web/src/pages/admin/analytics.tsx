import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Analytics = () => {
  const activityData = [
    { day: 'T2', posts: 45, comments: 120 },
    { day: 'T3', posts: 52, comments: 145 },
    { day: 'T4', posts: 48, comments: 132 },
    { day: 'T5', posts: 61, comments: 168 },
    { day: 'T6', posts: 55, comments: 151 },
    { day: 'T7', posts: 72, comments: 189 },
    { day: 'CN', posts: 89, comments: 220 },
  ];

  return (
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
  );
};

export default Analytics;
