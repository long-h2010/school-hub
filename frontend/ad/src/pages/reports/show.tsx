import {
  OverViewStats,
  ProductImages,
  ProductSettings,
} from '@/components/organisms';
import { ProductInfor } from '@/components/organisms/ProductInfor';
import { ProductDetail } from '@/types';
import {
  EditOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useShow } from '@refinedev/core';
import { Card, Divider, Empty, Skeleton, Switch } from 'antd';

export const ReportShow = () => {
  const {
    result: productData,
    query: { isLoading },
  } = useShow<ProductDetail>();

  const overview = [
    {
      title: 'Units Sold',
      value: `${productData?.purchases}`,
      color: 'green',
      icon: <ShoppingCartOutlined />,
    },
    {
      title: 'Views',
      value: `${productData?.views}`,
      color: 'blue',
      icon: <EyeOutlined />,
    },
    {
      title: 'Reviews',
      value: `${productData?.totalReviews}`,
      color: 'red',
      icon: <EditOutlined />,
    },
    {
      title: 'Avg Rating',
      value: `${productData?.rating.toFixed(2)}`,
      color: 'orange',
      icon: <StarOutlined />,
    },
  ];

  if (isLoading) return <Skeleton />;

  if (!productData) return <Empty />;

  return (
    <div className='flex flex-col gap-10'>
      <OverViewStats stats={overview} />
      <div className='grid grid-cols-1 md:grid-cols-3 flex gap-5'>
        <div className='col-span-1 flex flex-col gap-5'>
          {productData.images ? (
            <ProductImages images={productData.images} />
          ) : (
            <Skeleton.Image active />
          )}

          <Card>
            <span className='text-sm font-bold'>Quick Settings</span>
            <Divider />
            <div className='flex flex-col gap-4'>
              <div className='flex justify-between'>
                <span>Featured Product</span>
                <Switch />
              </div>
              <div className='flex justify-between'>
                <span>Visible on Store</span>
                <Switch />
              </div>
            </div>
          </Card>

          <ProductSettings />
        </div>

        <div className='flex flex-col lg:col-span-2'>
          <ProductInfor product={productData} />
        </div>
      </div>
    </div>
  );
};
