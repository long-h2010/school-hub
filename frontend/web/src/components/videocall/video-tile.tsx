import { MicOffIcon } from 'lucide-react';
import { AudioBars } from '.';

interface Props {
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
  speaking: boolean;
}

const VideoTile: React.FC<Props> = ({
  name,
  avatar,
  isMuted,
  isVideoOff,
  speaking,
}) => {
  return (
    <div
      className='relative w-full h-full rounded-2xl overflow-hidden transition-shadow duration-[400ms]'
      style={{
        background: 'linear-gradient(135deg,#1a2235,#0e1117)',
        boxShadow: speaking
          ? '0 0 0 2px #34d399,0 0 0 4px rgba(52,211,153,0.12)'
          : 'none',
      }}
    >
      {!isVideoOff && (
        <div
          className='absolute inset-0 opacity-[0.07]'
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      )}
      {isVideoOff && (
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
          <div
            className='w-14 h-14 rounded-full flex items-center justify-center text-[26px] border-2 border-white/[0.08]'
            style={{ background: 'linear-gradient(135deg,#2d3748,#1a202c)' }}
          >
            {avatar}
          </div>
          <span className='text-white/45 text-xs'>{name}</span>
        </div>
      )}
      <div
        className='absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2'
        style={{
          background: 'linear-gradient(to top,rgba(0,0,0,0.65),transparent)',
        }}
      >
        <div className='flex items-center gap-1.5'>
          <AudioBars active={speaking && !isMuted} />
          <span className='text-white text-xs font-medium'>{name}</span>
        </div>
        {isMuted && (
          <span className='text-red-400 flex'>
            <MicOffIcon size={14} />
          </span>
        )}
      </div>
    </div>
  );
};

export default VideoTile;
