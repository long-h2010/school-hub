import { VideoTile } from '.';
import { Ripple } from '../common';

interface Props {
  localRef: any;
  remoteRef: any;
  callee: any;
  connecting: boolean;
  muted: boolean;
  videoOff: boolean;
  speaking?: any;
}
const VideoArea: React.FC<Props> = ({
  localRef,
  remoteRef,
  callee,
  connecting,
  muted,
  videoOff,
  speaking,
}) => {
  return (
    <div className='relative mx-4 h-[400px]'>
      {!connecting ? (
        <div
          className='w-full h-full rounded-2xl flex flex-col items-center justify-center gap-5'
          style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)' }}
        >
          <div className='relative flex items-center justify-center'>
            <Ripple color='rgba(99,102,241,0.2)' size={90} />
            <div
              className='w-20 h-20 rounded-full flex items-center justify-center text-[38px] border-2 border-indigo-500/30 relative z-10'
              style={{
                background: 'linear-gradient(135deg,#312e81,#1e1b4b)',
              }}
            >
              <img src={callee.avatar || '/default-avatar.png'} alt='' className='rounded-full' />
            </div>
          </div>
          <div className='text-center'>
            <p className='text-white text-lg font-bold m-0 mb-1.5'>
              {callee.name}
            </p>
            <p className='text-white/40 text-[13px] m-0'>Đang đổ chuông…</p>
          </div>
        </div>
      ) : (
        <>
          <div className='w-full h-full'>
            <VideoTile
              ref={remoteRef}
              name={callee.name}
              avatar={callee.avatar}
              isMuted={false}
              isVideoOff={false}
              speaking={speaking === 'remote'}
            />
          </div>
          <div className='absolute bottom-3 right-3 w-[140px] h-[110px] rounded-[14px] overflow-hidden border-2 border-white/[0.12] shadow-[0_8px_24px_rgba(0,0,0,0.5)] z-10 transition-transform duration-200 cursor-pointer hover:scale-[1.04]'>
            <VideoTile
              ref={localRef}
              name='Bạn'
              avatar='🙂'
              isMuted={muted}
              isVideoOff={videoOff}
              speaking={speaking === 'local'}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VideoArea;
