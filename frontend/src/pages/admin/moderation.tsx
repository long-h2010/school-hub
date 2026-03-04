import { Shield } from 'lucide-react';

const Moderation = () => {
  return (
    <div className='space-y-6'>
      <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6'>
        <h3 className='text-lg font-bold text-gray-900 mb-6 flex items-center gap-2'>
          <Shield className='w-6 h-6 text-orange-500' />
          Báo cáo gần đây
        </h3>
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='flex items-center justify-between p-5 border-2 border-gray-100 rounded-xl hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-200'
            >
              <div className='flex items-center gap-4'>
                <div className='w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center'>
                  <Shield className='w-7 h-7 text-orange-600' />
                </div>
                <div>
                  <p className='font-bold text-gray-900'>
                    Nội dung vi phạm #{i}
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>
                    Báo cáo bởi 3 người dùng
                  </p>
                </div>
              </div>
              <button className='px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105'>
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Moderation;
