import { PhoneIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Ripple } from '../common';

interface Props {
  caller: any;
  onAccept: () => void;
  onDecline: () => void;
  visible: boolean;
}

const DeclineBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className='flex-1 h-[46px] rounded-[14px] border border-red-500/25 bg-red-500/[0.12] hover:bg-red-500/[0.22] text-red-400 flex items-center justify-center gap-2 text-[13px] font-semibold transition-all duration-[180ms] cursor-pointer outline-none'
    >
      <span className='rotate-[135deg] inline-flex'>
        <PhoneIcon size={16} />
      </span>
      Từ chối
    </button>
  );
}

function AcceptBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className='flex-1 h-[46px] rounded-[14px] border-none bg-gradient-to-br from-emerald-600 to-emerald-500 text-white flex items-center justify-center gap-2 text-[13px] font-semibold shadow-[0_4px_16px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_22px_rgba(16,185,129,0.55)] hover:scale-[1.02] transition-all duration-[180ms] cursor-pointer outline-none'
    >
      <PhoneIcon size={16} />
      Chấp nhận
    </button>
  );
}

const IncomingCall: React.FC<Props> = ({
  caller,
  onAccept,
  onDecline,
  visible,
}) => {
  const [show, setShow] = useState<boolean>(false);
  console.log(show, caller);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(t);
    } else setShow(false);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className='fixed top-6 right-6 z-[99999] w-80 rounded-[22px] overflow-hidden border border-white/[0.08] backdrop-blur-xl transition-all duration-[400ms]'
      style={{
        background: 'rgba(14,17,23,0.96)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        transform: show
          ? 'translateX(0) scale(1)'
          : 'translateX(40px) scale(0.94)',
        opacity: show ? 1 : 0,
        transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div
        className='h-[3px]'
        style={{
          background:
            'linear-gradient(90deg,transparent,#34d399,#10b981,transparent)',
          backgroundSize: '200%',
          animation: 'vcShimmer 2s linear infinite',
        }}
      />
      <div className='p-[18px]'>
        <div className='flex items-center gap-1.5 mb-3.5'>
          <span className='w-[7px] h-[7px] rounded-full bg-emerald-400 inline-block animate-[vcPulse_1.2s_infinite]' />
          <span className='text-white/40 text-[11px] tracking-[0.08em] uppercase'>
            Cuộc gọi video đến
          </span>
        </div>
        <div className='flex items-center gap-3.5 mb-5'>
          <div className='relative shrink-0 flex items-center justify-center w-[54px] h-[54px]'>
            <div className='absolute inset-[-10px] flex items-center justify-center'>
              <Ripple color='rgba(52,211,153,0.2)' size={54} />
            </div>
            <div
              className='w-[54px] h-[54px] rounded-full flex items-center justify-center text-[26px] border-2 border-indigo-500/30 relative z-10'
              style={{ background: 'linear-gradient(135deg,#312e81,#1e1b4b)' }}
            >
              {<img src={caller.avatar} alt='' className='rounded-full' />}
            </div>
          </div>
          <div>
            <p className='text-white font-bold text-base m-0 mb-[3px]'>
              {caller.name}
            </p>
            <p className='text-white/40 text-xs m-0'>Đang gọi video cho bạn…</p>
          </div>
        </div>
        <div className='flex gap-3'>
          <DeclineBtn onClick={onDecline} />
          <AcceptBtn onClick={onAccept} />
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
