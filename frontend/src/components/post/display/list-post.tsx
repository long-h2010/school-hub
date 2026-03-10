import { useEffect, useRef, useState } from 'react';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Image } from 'lucide-react';
import AxiosClient from '../../../api/axios-client';
import type { Post } from '../../../types/post';
import { mapPostApi } from '../../../utils/map-api';
import { PostCard } from '../card';
import PostDetail from './post-detail';

interface Props {
  getPostsApi: string;
  newPost?: Post | null;
}

const ListPost: React.FC<Props> = ({ getPostsApi, newPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (newPost) setPosts([newPost, ...posts]);
  }, [newPost]);

  const handleGetFeed = async ({ pageParam = 1, limit = 15 }) => {
    const res = await AxiosClient.get(
      `${getPostsApi}?page=${pageParam}&limit=${limit}`,
    );
    return res.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['feed'],
      queryFn: handleGetFeed,
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextPage : undefined,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const postsData = data.pages.flatMap((page: any) => page.posts);

  useEffect(() => {
    setPosts(postsData.map((post: any) => mapPostApi(post)));
  }, [data]);

  const handleLike = (postId: string): void => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }),
    );
  };

  const handleOpenPostDetail = (postId: string): void => {
    const post = posts.find((p) => p.id === postId);
    if (post) setSelectedPost(post);
  };

  return (
    <>
      {selectedPost ? (
        <PostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
        />
      ) : (
        <></>
      )}

      {posts.length === 0 ? (
        <div className='text-center'>
          <div className='w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3'>
            <Image className='w-8 h-8 text-blue-600' />
          </div>
          <p className='text-gray-500 text-sm'>Chưa có bài viết nào</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onOpenPostDetail={handleOpenPostDetail}
          />
        ))
      )}
      <div ref={loaderRef} className='text-center py-6 text-gray-500'></div>
    </>
  );
};

export default ListPost;
