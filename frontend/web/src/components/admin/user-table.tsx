import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const UserTable: React.FC<{
  users: any[];
  onBanClick: (user: any) => void;
  onUnbanClick: (user: any) => void;
}> = ({ users, onBanClick, onUnbanClick }) => {
  console.log(users);
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
                  <img src={user.avatar} alt={user.name} className='w-11 h-11 rounded-xl' />
                  <div>
                    <p className='font-semibold text-gray-900'>{user.name}</p>
                    <p className='text-xs text-gray-500 flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      {user.createdAt}
                    </p>
                  </div>
                </div>
              </td>
              <td className='py-4 px-6 text-gray-600 font-medium'>
                {user.email}
              </td>
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
                <span className='text-gray-900 font-bold'>
                  {user.posts ?? 0}
                </span>
              </td>
              <td className='py-4 px-6'>
                <span className='text-gray-900 font-bold'>
                  {user.comments ?? 0}
                </span>
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

export default UserTable;
