import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { User } from '../types/user';
import AxiosClient from '../api/axios-client';
import { SubmitButton } from '../components/common';
import { useAuth } from '../contexts/auth-context';
import ListPost from '../components/post/list-post';

const Profile = () => {
  const params = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const itsMe = location.pathname == '/me';
  const userId = params.id ?? user._id;
  const [profile, setProfile] = useState<User>();

  if (params.id == user._id) navigate('/me');

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

  // const handleFollow = () => {};

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
                className='w-32 h-32 rounded-full border-4 border-white shadow-xl'
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
                <></>
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
                  {profile?.followers}
                </p>
                <p className='text-sm text-gray-500'>Người theo dõi</p>
              </div>
              <div>
                <p className='text-xl font-bold text-gray-900'>
                  {profile?.following}
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
    </div>
  );
};

export default Profile;
