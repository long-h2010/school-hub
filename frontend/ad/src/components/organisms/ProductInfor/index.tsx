import { formatVND } from '@/lib/utils';
import { ProductDetail } from '@/types';
import { Badge, Card } from 'antd';

export const ProductInfor = ({ product }: { product: ProductDetail }) => {
  const { name, price, status } = product;

  const color =
    status == 'active' ? 'green' : status == 'out of stock' ? 'red' : 'orange';

  const text = {
    green: 'text-green-500',
    red: 'text-red-500',
    orange: 'text-orange-500',
  };
  
  const badge = {
    status: color,
    text: text[color],
  };

  return (
    <Card>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-4 capitalize'>
          <span className='text-lg font-bold'>{name}</span>
          <Badge
            color={badge.status}
            text={<span className={badge.text}>{status}</span>}
          />
        </div>
        <span className='text-lg font-bold'>{formatVND(price)}</span>
      </div>
    </Card>
  );
};
