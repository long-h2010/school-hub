import { useEffect, useState } from 'react';
import { t } from 'i18next';
import AxiosClient from '../api/axios-client';
import { useAuth } from '../contexts/auth-context';
import useNewPost from '../hooks/use-newpost';
import { MainSidebar } from '../components/layout';
import { CreatePostButton, CreatePostModal } from '../components/post/create';
import type { Post, TabType } from '../types/post';
import { mapPostApi } from '../utils/map-api';
import { ListPost } from '../components/post/display';

const Home = () => {
  const { user } = useAuth();
  const newPostsApi = import.meta.env.VITE_APP_GET_FEED_ENDPOINT;
  const hotPostsApi = import.meta.env.VITE_APP_GET_FEED_ENDPOINT;
  const followingPostsApi = import.meta.env.VITE_APP_GET_FEED_ENDPOINT;
  const likedPostsApi = import.meta.env.VITE_APP_GET_FEED_ENDPOINT;
  const [getPostsApi, setGetPostsApi] = useState<string>(newPostsApi);
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const { newPost, updatePost, clearPost } = useNewPost();
  const [newPostData, setNewPostData] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab == 'new') setGetPostsApi(newPostsApi);
    if (activeTab == 'hot') setGetPostsApi(hotPostsApi);
    if (activeTab == 'following') setGetPostsApi(followingPostsApi);
    if (activeTab == 'liked') setGetPostsApi(likedPostsApi);
  }, [activeTab]);

  const handleCreateNewPost = async () => {
    try {
      const data = new FormData();
      data.append('content', newPost?.content ?? '');
      (newPost?.images ?? []).forEach((file) => data.append('images', file));
      await AxiosClient.post(import.meta.env.VITE_APP_POST_ENDPOINT, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((res) => {
        const newPost = {
          ...res.data,
          author: {
            name: user.name,
            avatar: user.avatar,
          },
          likesCount: 0,
        };

        setNewPostData(mapPostApi(newPost));
      });
    } catch (error) {
      console.error('Error creating post:', error);
    }
    clearPost();
  };

  return (
    <>
      <MainSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className='ml-64 pt-20 px-4 pb-8'>
        <div className='max-w-2xl mx-auto'>
          <CreatePostButton
            avatar={user.avatar}
            onClick={() => setIsModalOpen(true)}
          />

          <CreatePostModal
            avatar={user.avatar}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            updatePost={updatePost}
            onCreatePost={handleCreateNewPost}
          />

          <div className='mb-4'>
            <h2 className='text-xl font-bold text-gray-800'>
              {activeTab === 'new' && `📝 ${t('new-post.title')}`}
              {activeTab === 'hot' && `🔥 ${t('new-post.title')}`}
              {activeTab === 'following' && `🔔 ${t('following-post.title')}`}
              {activeTab === 'liked' && `💖 ${t('new-post.title')}`}
            </h2>
            <p className='text-sm text-gray-500 mt-1 ml-1'>
              {activeTab === 'new' && t('new-post.description')}
              {activeTab === 'hot' && t('hot-post.description')}
              {activeTab === 'following' && t('following-post.description')}
              {activeTab === 'liked' && t('liked-post.description')}
            </p>
          </div>

          <ListPost getPostsApi={getPostsApi} newPost={newPostData} />
        </div>
      </div>
    </>
  );
};

export default Home;
