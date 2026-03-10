import {
  Home,
  Bell,
  Menu,
  GraduationCap,
  MessageCircleMoreIcon,
  Search,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import _, { debounce } from 'lodash';
import AxiosClient from '../../api/axios-client';
import { IconButton, SearchField } from '../common';
import { ProfileMenu, SearchCard } from '../user';

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const routes: any = [
    { key: 1, path: '/', icon: Home },
    { key: 2, path: '/chat', icon: MessageCircleMoreIcon },
  ];

  const handleSearch = useCallback(
    debounce(async (value: string) => {
      if (value) {
        const res = await AxiosClient.post(
          `${import.meta.env.VITE_APP_SEARCH_USER_ENDPOINT}`,
          {
            search: value,
          },
        );

        setSearchResults(res.data);
        setShowSearchResults(true);
      } else setSearchResults([]);
    }, 500),
    [],
  );

  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue, handleSearch]);

  return (
    <header className='bg-white shadow-sm fixed top-0 w-full z-50'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between h-14'>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-2 mr-4' onClick={() => navigate('/')}>
              <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
                <GraduationCap className='w-6 h-6 text-white' />
              </div>
              <span className='text-xl font-bold text-blue-600'>DTUHub</span>
            </div>
            <div className='hidden md:flex items-center bg-gray-100 rounded-full ml-4 relative'>
              <SearchField
                width='w-48'
                value={searchValue}
                setValue={setSearchValue}
              />
              {showSearchResults && (
                <>
                  <div
                    className='fixed inset-0 z-10'
                    onClick={() => setShowSearchResults(false)}
                  />
                  <div className='absolute top-full left-0 w-96 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 max-h-80 overflow-hidden'>
                    <div className='p-3 border-b border-gray-100'>
                      <h3 className='text-sm font-semibold text-gray-700'>
                        Kết quả tìm kiếm
                      </h3>
                    </div>
                    <div className='overflow-y-auto max-h-72'>
                      {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                          <SearchCard
                            key={user._id}
                            user={user}
                            onClick={() => {
                              navigate(`profile/${user._id}`);
                              setSearchValue('');
                              setShowSearchResults(false);
                            }}
                          />
                        ))
                      ) : (
                        <div className='p-8 text-center'>
                          <div className='w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                            <Search className='w-8 h-8 text-blue-600' />
                          </div>
                          <p className='text-sm text-gray-600 font-medium mb-1'>
                            Không tìm thấy
                          </p>
                          <p className='text-xs text-gray-400'>
                            Thử tìm với từ khóa khác
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className='flex space-x-4'>
            {routes.map((route: any) => (
              <IconButton
                key={route.key}
                icon={route.icon}
                active={path === route.path}
                onClick={() => navigate(route.path)}
              />
            ))}
          </div>

          <div className='flex items-center space-x-2'>
            <button className='p-2 hover:bg-gray-100 rounded-full relative'>
              <Bell className='w-6 h-6' />
              <span className='absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                5
              </span>
            </button>
            <button className='p-2 hover:bg-gray-100 rounded-full'>
              <Menu className='w-6 h-6' />
            </button>
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
