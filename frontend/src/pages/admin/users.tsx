import { Search, UserX } from 'lucide-react';
import { UserTable } from '../../components/admin';
import { Alert, Pagination } from '../../components/common';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AxiosClient from '../../api/axios-client';
import { mapUserApi } from '../../utils/map-api';

const BanModal: React.FC<{
  user: any | null;
  banType: string;
  banDuration: string;
  onClose: () => void;
  onBanTypeChange: (type: string) => void;
  onDurationChange: (duration: string) => void;
  onConfirm: () => void;
}> = ({
  user,
  banType,
  banDuration,
  onClose,
  onBanTypeChange,
  onDurationChange,
  onConfirm,
}) => {
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

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [alert, setAlert] = useState<{
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await AxiosClient.get(import.meta.env.VITE_APP_USER_ENDPOINT);
      setUsers(res.data.map(mapUserApi));
    } catch (err) {
      console.error('Failed to load users', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredAndPaginated = useMemo(() => {
    let filtered = users;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = users.filter((user) => {
        const name = (user.name || '').toString().toLowerCase();
        const email = (user.email || '').toString().toLowerCase();
        return name.includes(term) || email.includes(term);
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const items = filtered.slice(start, end);

    return {
      items,
      total,
      totalPages,
      startIndex: total > 0 ? start + 1 : 0,
      endIndex: Math.min(end, total),
    };
  }, [users, searchTerm, currentPage, itemsPerPage]);

  const {
    items: currentUsers,
    total,
    totalPages,
    startIndex,
    endIndex,
  } = filteredAndPaginated;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handleBan = (id: string) => {};

  const handleUnban = (user: any) => {};

  return (
    <>
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
          onBanClick={handleBan}
          onUnbanClick={handleUnban}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={total}
          onPageChange={setCurrentPage}
          onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      </div>
      {/* 
            <BanModal
                user={selectedUser}
                banType={banType}
                banDuration={banDuration}
                onClose={() => setSelectedUser(null)}
                onBanTypeChange={setBanType}
                onDurationChange={setBanDuration}
                onConfirm={() => selectedUser && handleBan(selectedUser, banType, banDuration)}
            /> */}

      {alert && <Alert type={alert.type} message={alert.message} />}
    </>
  );
};

export default Users;
