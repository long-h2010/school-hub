import { Stat } from '@/components/molecules';
import { Card, Statistic } from 'antd';

interface Stat {
  title: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}
export const OverViewStats = ({ stats }: { stats: Stat[] }) => {
  return (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat) => (
        <Stat title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} suffix={stat.suffix} />
      ))}
    </div>
  );
};
