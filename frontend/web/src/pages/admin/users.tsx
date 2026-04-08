import { Search } from 'lucide-react';
import { UserTable } from '../../components/admin';
import { Alert, Pagination } from '../../components/common';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AxiosClient from '../../api/axios-client';
import { mapUserApi } from '../../utils/map-api';

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  // const [selectedUser, setSelectedUser] = useState<any | null>(null);
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

  const handleBan = (id: string) => { setAlert({ type: 'success', message: `User ${id} has been banned.` }); };

  const handleUnban = (user: any) => { console.log('Unban user', user.id); };

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
