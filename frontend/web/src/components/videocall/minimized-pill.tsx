import { PhoneIcon } from 'lucide-react';

interface Props {
  callee: any;
  timer: string;
  onExpand: () => void;
  onEnd: () => void;
}

const MinimizedPill: React.FC<Props> = ({ callee, timer, onExpand, onEnd }) => {
  return (
    <div
      className='fixed bottom-6 right-6 z-[50001] flex items-center gap-3 bg-[#0e1117] border border-white/10 rounded-[18px] px-4 py-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-[#161d2c] transition-colors'
      style={{ animation: 'vcFloatIn 0.3s ease-out' }}
      onClick={onExpand}
    >
      <div className='w-9 h-9 rounded-xl bg-[#1a2030] flex items-center justify-center text-lg shrink-0'>
        {callee.emoji}
      </div>
      <div className='min-w-0'>
        <p className='text-white text-[13px] font-semibold m-0 truncate'>
          {callee.name}
        </p>
        <p className='text-emerald-400 text-[11px] m-0 font-mono'>{timer}</p>
      </div>
      <span className='w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-[vcPulse_1.5s_infinite]' />
      {/* End call from pill */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEnd();
        }}
        className='ml-1 w-8 h-8 rounded-xl bg-red-500/20 hover:bg-red-500 border border-red-500/30 flex items-center justify-center text-red-400 hover:text-white transition-all duration-150 shrink-0 outline-none'
        title='Kết thúc cuộc gọi'
      >
        <span className='rotate-[135deg] inline-flex'>
          <PhoneIcon size={14} />
        </span>
      </button>
    </div>
  );
};

export default MinimizedPill;
