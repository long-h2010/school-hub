import { Settings2 } from 'lucide-react';

const Settings = () => {
  return (
    <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6'>
      <h3 className='text-lg font-bold text-gray-900 mb-6 flex items-center gap-2'>
        <Settings2 className='w-6 h-6 text-gray-600' />
        Cài đặt hệ thống
      </h3>
      <div className='space-y-6'>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Thời gian cấm mặc định
          </label>
          <select className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium'>
            <option>7 ngày</option>
            <option>14 ngày</option>
            <option>30 ngày</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-3'>
            Tự động kiểm duyệt
          </label>
          <div className='flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100'>
            <input
              type='checkbox'
              className='w-5 h-5 text-blue-600 rounded border-2 border-gray-300'
            />
            <span className='ml-3 text-gray-900 font-medium'>
              Bật kiểm duyệt tự động
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
