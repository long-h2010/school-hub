import { useState } from 'react';
import { X, Flag, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import AxiosClient from '../../api/axios-client';

interface Props {
  postId: string;
  onClose: () => void;
}

const REASONS = [
  {
    value: 'toxic',
    label: 'Ngôn từ toxic',
    desc: 'Ngôn từ nhạy cảm',
  },
  {
    value: 'spam',
    label: 'Spam hoặc quảng cáo',
    desc: 'Nội dung không mong muốn, lặp lại',
  },
  {
    value: 'hate speech',
    label: 'Ngôn từ thù hận',
    desc: 'Kích động bạo lực hoặc phân biệt đối xử',
  },
  {
    value: 'misinformation',
    label: 'Thông tin sai sự thật',
    desc: 'Tin giả hoặc nội dung gây hiểu lầm',
  },
  {
    value: 'violence',
    label: 'Bạo lực hoặc nguy hiểm',
    desc: 'Nội dung bạo lực hoặc đe doạ',
  },
  {
    value: 'sexual',
    label: 'Nội dung nhạy cảm',
    desc: 'Nội dung 18+ không phù hợp',
  },
  {
    value: 'other',
    label: 'Lý do khác',
    desc: 'Vấn đề không được liệt kê ở trên',
  },
];

type Step = 'select' | 'loading' | 'success';

const ReportModal: React.FC<Props> = ({ postId, onClose }) => {
  const [selected, setSelected] = useState<string>('');
  const [step, setStep] = useState<Step>('select');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selected) return;
    setStep('loading');
    setError('');
    try {
      await AxiosClient.post(import.meta.env.VITE_APP_REPORT_ENDPOINT, {
        post: postId,
        reason: selected,
      });
      setStep('success');
      setTimeout(onClose, 2000);
    } catch {
      setError('Gửi báo cáo thất bại. Vui lòng thử lại.');
      setStep('select');
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal'>
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
          <div className='flex items-center gap-2'>
            <Flag className='w-4 h-4 text-red-500' />
            <h2 className='font-bold text-gray-900'>Báo cáo bài viết</h2>
          </div>
          <button
            onClick={onClose}
            className='w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        {/* Body */}
        {step === 'success' ? (
          <div className='flex flex-col items-center justify-center py-12 gap-3'>
            <CheckCircle2 className='w-12 h-12 text-green-500' />
            <p className='font-semibold text-gray-800'>Đã gửi báo cáo</p>
            <p className='text-sm text-gray-500'>Cảm ơn bạn đã phản hồi</p>
          </div>
        ) : (
          <>
            <p className='text-sm text-gray-500 px-5 pt-4 pb-2'>
              Chọn lý do bạn muốn báo cáo bài viết này:
            </p>

            <ul className='px-3 pb-3 space-y-1 max-h-80 overflow-y-auto'>
              {REASONS.map((r) => (
                <li key={r.value}>
                  <button
                    onClick={() => setSelected(r.value)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-colors ${
                      selected === r.value
                        ? 'bg-red-50 border border-red-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm font-medium ${selected === r.value ? 'text-red-600' : 'text-gray-800'}`}
                      >
                        {r.label}
                      </p>
                      <p className='text-xs text-gray-400 mt-0.5'>{r.desc}</p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${selected === r.value ? 'text-red-400' : 'text-gray-300'}`}
                    />
                  </button>
                </li>
              ))}
            </ul>

            {error && <p className='text-xs text-red-500 px-5 pb-2'>{error}</p>}

            {/* Footer */}
            <div className='flex justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50'>
              <button
                onClick={onClose}
                className='px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors'
              >
                Huỷ
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selected || step === 'loading'}
                className='px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2'
              >
                {step === 'loading' && (
                  <Loader2 className='w-4 h-4 animate-spin' />
                )}
                Gửi báo cáo
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal { animation: modal-in 0.2s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
    </div>
  );
};

export default ReportModal;
