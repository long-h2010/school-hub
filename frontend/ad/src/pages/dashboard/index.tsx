import { OverViewStats } from '@/components/organisms';
import {
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import { useCustom } from '@refinedev/core';
import { Card, Skeleton } from 'antd';

export const Dashboard = () => {
  const { result, query } = useCustom({
    url: import.meta.env.VITE_APP_USERS_OVERVIEW_ENDPOINT,
    method: 'get',
  });

  if (query.isLoading) return <Skeleton />;

  const { total, growthPercent, monthly } = result.data;

  const stats = [
    {
      title: 'Total Users',
      value: total,
      color: 'blue',
      icon: <UserOutlined />,
      suffix: (
        <div className='flex gap-1 text-[0.6rem] items-center'>
          <span
            className={growthPercent > 0 ? 'text-green-500' : 'text-red-500'}
          >
            {growthPercent.toFixed(2)} %
          </span>
          <span className='text-gray-500'>vs last month</span>
        </div>
      ),
    },
    {
      title: 'Posts',
      value: 0,
      color: 'green',
      icon: <FileTextOutlined />,
      suffix: (
        <div className='flex gap-1 text-[0.6rem] items-center'>
          <span
            className={growthPercent > 0 ? 'text-green-500' : 'text-red-500'}
          >
            {growthPercent.toFixed(2)} %
          </span>
          <span className='text-gray-500'>vs last month</span>
        </div>
      ),
    },
    {
      title: 'Reports',
      value: 0,
      color: 'red',
      icon: <WarningOutlined />,
      suffix: (
        <div className='flex gap-1 text-[0.6rem] items-center'>
          <span className={'text-red-500'}>{0}</span>
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
          <span
            className={growthPercent > 0 ? 'text-green-500' : 'text-red-500'}
          >
            {0}
          </span>
          <span className='text-gray-500'>in this month</span>
        </div>
      ),
    },
  ];

  const formattedUserGrowthData = monthly.map((item: any) => ({
    date: `${item._id.month}/${item._id.year}`,
    value: item.count,
  }));

  const growthUserChart = {
    data: { value: formattedUserGrowthData },
    xField: 'date',
    yField: 'value',
    height: 300,
  };

  return (
    <div className='flex flex-col gap-10'>
      <OverViewStats stats={stats} />

      <div className='grid grid-cols-1 lg:grid-cols-2'>
        <div className='cols-span-1'>
          <Card>
            <div className='flex flex-col gap-1 px-5 mb-3'>
              <span className='text-md font-semibold'>User Growth</span>
              <span className='text-xs'>Last 12 months</span>
            </div>
            <Area {...growthUserChart} />
          </Card>
        </div>
      </div>
    </div>
  );
};
