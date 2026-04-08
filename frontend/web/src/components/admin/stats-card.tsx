interface StatCard {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  change: string;
  bgGradient: string;
}

const StatsCard: React.FC<{ stats: StatCard[] }> = ({ stats }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {stats.map((stat, index) => (
        <div
          key={index}
          className='group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden'
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          ></div>
          <div className='relative p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-lg`}
              >
                <stat.icon className='w-6 h-6 text-white' />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  stat.change.startsWith('+')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className='text-sm text-gray-600 mb-1 font-medium'>
              {stat.label}
            </p>
            <p className='text-3xl font-bold text-gray-900'>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
