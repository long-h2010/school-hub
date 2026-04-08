import { formatNumberDetail } from '@/lib/utils';
import { Card, theme } from 'antd';

export const Stat = ({
  title,
  value,
  icon,
  color,
  suffix,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  suffix?: React.ReactNode;
}) => {
  const {
    token: { colorText },
  } = theme.useToken();

  return (
    <Card style={{ color: color }}>
      <div className='flex flex-col'>
        <div className='flex justify-between'>
          <span
            className='!text-xs uppercase tracking-wide'
            style={{ color: colorText }}
          >
            {title}
          </span>
          <div>{icon}</div>
        </div>
        <div className='flex mt-5 gap-2'>
          <span className='text-3xl font-bold'>{formatNumberDetail(value)}</span>
          <span className='text-sm content-end'>{suffix}</span>
        </div>
      </div>
    </Card>
  );
};
