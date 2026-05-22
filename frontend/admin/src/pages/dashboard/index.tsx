import { OverViewStats } from '@/components/organisms';
import {
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Area, Column } from '@ant-design/plots';
import { useCustom } from '@refinedev/core';
import { Card, Skeleton } from 'antd';

export const Dashboard = () => {
  const { result: usersResult, query: usersQuery } = useCustom({
    url: import.meta.env.VITE_APP_USERS_OVERVIEW_ENDPOINT,
    method: 'get',
  });

  const { result: postsResult, query: postsQuery } = useCustom({
    url: import.meta.env.VITE_APP_POSTS_OVERVIEW_ENDPOINT,
    method: 'get',
  });

  const { result: reportsResult, query: reportsQuery } = useCustom({
    url: import.meta.env.VITE_APP_REPORTS_OVERVIEW_ENDPOINT,
    method: 'get',
  });

  const isLoading =
    usersQuery.isLoading || postsQuery.isLoading || reportsQuery.isLoading;

  if (isLoading) return <Skeleton />;

  const {
    total: totalUsers,
    growthPercent: usersGrowthPercent,
    monthly: usersMonthly,
  } = usersResult.data;
  const {
    total: totalPosts,
    growthPercent: postsGrowthPercent,
    monthly: postsMonthly,
  } = postsResult.data;
  
  const {
    total: totalReports,
    pendingReview,
    monthly: reportsMonthly,
  } = reportsResult.data;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      color: 'blue',
      icon: <UserOutlined />,
      suffix: (
        <div className='flex gap-1 text-[0.6rem] items-center'>
          <span
            className={
              usersGrowthPercent > 0 ? 'text-green-500' : 'text-red-500'
            }
          >
            {usersGrowthPercent.toFixed(2)} %
          </span>
          <span className='text-gray-500'>vs last month</span>
        </div>
      ),
    },
    {
      title: 'Posts',
      value: totalPosts,
      color: 'green',
      icon: <FileTextOutlined />,
      suffix: (
        <div className='flex gap-1 text-[0.6rem] items-center'>
          <span
            className={
              postsGrowthPercent > 0 ? 'text-green-500' : 'text-red-500'
            }
          >
            {postsGrowthPercent.toFixed(2)} %
          </span>
          <span className='text-gray-500'>vs last month</span>
        </div>
      ),
    },
    {
      title: 'Reports',
      value: totalReports,
      color: 'red',
      icon: <WarningOutlined />,
      suffix: (
        <div className='flex gap-1 text-[0.6rem] items-center'>
          <span className='text-red-500'>{pendingReview}</span>
          <span className='text-gray-500'>need review</span>
        </div>
      ),
    },
    {
      title: 'Ad Revenue',
      value: 0,
      color: 'purple',
      icon: <DollarOutlined />,
      suffix: (
        <div className='flex gap-1 text-[0.6rem] items-center'>
          <span className='text-green-500'>0</span>
          <span className='text-gray-500'>in this month</span>
        </div>
      ),
    },
  ];

  const formatMonthly = (monthly: any[]) =>
    monthly.map((item) => ({
      date: `${item._id.month}/${item._id.year}`,
      value: item.count,
    }));

  const userGrowthChart = {
    data: { value: formatMonthly(usersMonthly) },
    xField: 'date',
    yField: 'value',
    height: 250,
  };

  const postGrowthChart = {
    data: { value: formatMonthly(postsMonthly) },
    xField: 'date',
    yField: 'value',
    height: 250,
    style: { fill: '#22c55e' }, 
  };

  return (
    <div className='flex flex-col gap-10'>
      <OverViewStats stats={stats} />

      <div className='grid grid-cols-2 gap-6'>
        <Card>
          <div className='flex flex-col gap-1 px-5 mb-3'>
            <span className='text-md font-semibold'>User Growth</span>
            <span className='text-xs text-gray-500'>Last 12 months</span>
          </div>
          <Area {...userGrowthChart} />
        </Card>

        <Card>
          <div className='flex flex-col gap-1 px-5 mb-3'>
            <span className='text-md font-semibold'>Post Growth</span>
            <span className='text-xs text-gray-500'>Last 12 months</span>
          </div>
          <Area {...postGrowthChart} />
        </Card>
      </div>
    </div>
  );
};
