import { UserX } from "lucide-react";

const BanModal: React.FC<{
  user: any | null;
  banType: string;
  banDuration: string;
  onClose: () => void;
  onBanTypeChange: (type: string) => void;
  onDurationChange: (duration: string) => void;
  onConfirm: () => void;
}> = ({
  user,
  banType,
  banDuration,
  onClose,
  onBanTypeChange,
  onDurationChange,
  onConfirm,
}) => {
  if (!user) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in duration-200'>
        <div className='p-6 border-b border-gray-100'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30'>
              <UserX className='w-7 h-7 text-white' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-gray-900'>
                Cấm/Hạn chế người dùng
              </h3>
              <p className='text-sm text-gray-600 mt-1'>{user.name}</p>
            </div>
          </div>
        </div>

        <div className='p-6 space-y-5'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Loại hạn chế
            </label>
            <select
              value={banType}
              onChange={(e) => onBanTypeChange(e.target.value)}
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium'
            >
              <option value='all'>🚫 Cấm hoàn toàn</option>
              <option value='post'>📝 Cấm đăng bài</option>
              <option value='comment'>💬 Cấm bình luận</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Thời gian
            </label>
            <select
              value={banDuration}
              onChange={(e) => onDurationChange(e.target.value)}
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium'
            >
              <option value='1'>1 ngày</option>
              <option value='3'>3 ngày</option>
              <option value='7'>7 ngày</option>
              <option value='14'>14 ngày</option>
              <option value='30'>30 ngày</option>
              <option value='permanent'>⏰ Vĩnh viễn</option>
            </select>
          </div>

          <div className='flex gap-3 pt-2'>
            <button
              onClick={onClose}
              className='flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200'
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className='flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105'
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanModal;
