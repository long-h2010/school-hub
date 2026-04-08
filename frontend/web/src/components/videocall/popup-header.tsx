import { MinimizeIcon, X } from 'lucide-react';
import { IconButton } from '../common';

interface Props {
  connecting: boolean;
  sharing: boolean;
  timer: any;
  onMinimize: () => void;
  handleEnd: () => void;
}

const PopupHeader: React.FC<Props> = ({
  connecting,
  sharing,
  timer,
  onMinimize,
  handleEnd,
}) => {
  return (
    <div className='flex items-center justify-between px-5 pt-4 pb-2.5'>
      <div className='flex items-center gap-2.5'>
        <span
          className='w-2 h-2 rounded-full inline-block animate-[vcPulse_1.5s_infinite]'
          style={{ background: connecting ? '#34d399' : '#f59e0b' }}
        />
        <span className='text-white/60 text-[13px] font-mono tracking-[3px]'>
          {connecting ? timer : 'Đang kết nối…' }
        </span>
        {sharing && connecting && (
          <span className='text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25'>
            Đang chia sẻ
          </span>
        )}
      </div>
      <div className='flex gap-2'>
        <IconButton onClick={onMinimize} icon={MinimizeIcon} />
        <IconButton onClick={handleEnd} icon={X} hoverBgColor={'bg-red-500'} />
      </div>
    </div>
  );
};

export default PopupHeader;
