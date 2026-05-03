import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { User } from '../types/user';
import AxiosClient from '../api/axios-client';
import { SubmitButton } from '../components/common';
import { useAuth } from '../contexts/auth-context';
import { ListPost } from '../components/post/display';
import UpdateProfileModal from '../components/user/update-profile-modal';

const Profile = () => {
  const params = useParams();
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const itsMe = location.pathname === '/me';
  const userId = params.id ?? user._id;
  const [profile, setProfile] = useState<User>();
  const [showEditModal, setShowEditModal] = useState(false);

  if (params.id === user._id) navigate('/me');

  const fetchUser = async () => {
    const res = await AxiosClient.get(
      `${import.meta.env.VITE_APP_USER_ENDPOINT}/${userId}`,
    );
    setProfile(res.data);
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleClickChat = async () => {
    const res = await AxiosClient.post(import.meta.env.VITE_APP_CHAT_ENDPOINT, {
      sendTo: [userId],
    });
    localStorage.setItem('chat', res.data._id);
    navigate('/chat');
  };

  const handleProfileUpdated = (updatedUser: User) => {
    setProfile(updatedUser);
    if (itsMe && setUser) setUser(updatedUser);
  };

  return (
    <div className='min-h-screen bg-gray-50 pt-14'>
      <div className='max-w-4xl mx-auto px-4 py-6'>
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='relative h-48 bg-gradient-to-r from-blue-500 to-purple-600'>
            <img
              src={profile?.coverPhoto}
              alt='Cover'
              className='w-full h-full object-cover opacity-80'
            />
            <div className='absolute -bottom-16 left-6'>
              <img
                src={profile?.avatar}
                alt={profile?.name}
                className='w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover'
              />
            </div>
          </div>

          <div className='pt-20 pb-6 px-6'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 mb-1'>
                  {profile?.name}
                </h1>
                <p className='text-gray-600'>{profile?.bio}</p>
              </div>

              {itsMe ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className='flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-4 h-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z'
                    />
                  </svg>
                  Chỉnh sửa trang cá nhân
                </button>
              ) : (
                <div className='flex space-x-2'>
                  <SubmitButton
                    width='w-36'
                    label={profile?.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                    onClick={() => {}}
                    color={
                      profile?.isFollowing
                        ? 'bg-gray-100'
                        : 'from-blue-600 to-purple-600'
                    }
                    textSize='text-sm'
                    textColor={
                      profile?.isFollowing ? 'text-gray-700' : 'text-white'
                    }
                  />
                  <SubmitButton
                    width='w-36'
                    label='Nhắn tin'
                    onClick={() => handleClickChat()}
                    color='bg-gray-100'
                    textSize='text-sm'
                    textColor='text-gray-700'
                  />
                </div>
              )}
            </div>

            <div className='flex space-x-8 py-4 border-t border-gray-100'>
              <div>
                <p className='text-xl font-bold text-gray-900'>{0}</p>
                <p className='text-sm text-gray-500'>Bài viết</p>
              </div>
              <div>
                <p className='text-xl font-bold text-gray-900'>
                  {profile?.followers ?? 0}
                </p>
                <p className='text-sm text-gray-500'>Người theo dõi</p>
              </div>
              <div>
                <p className='text-xl font-bold text-gray-900'>
                  {profile?.following ?? 0}
                </p>
                <p className='text-sm text-gray-500'>Đang theo dõi</p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 bg-white rounded-2xl shadow-lg p-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Bài viết</h2>
          <div className='py-8'>
            <ListPost
              key={userId}
              getPostsApi={`${
                import.meta.env.VITE_APP_GET_POST_AUTHOR_ENDPOINT
              }/${userId}`}
            />
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showEditModal && profile && (
        <UpdateProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default Profile;
