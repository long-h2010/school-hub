const AudioBars: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className='flex items-end gap-[2px] h-[14px]'>
      {[0.4, 0.8, 1, 0.6, 0.75].map((h, i) => (
        <span
          key={i}
          className='w-[3px] rounded-sm bg-emerald-400 block transition-[height] duration-100'
          style={{
            height: active ? `${h * 14}px` : '3px',
            animation: active
              ? `vcAudioPulse 0.7s ease-in-out ${i * 0.1}s infinite alternate`
              : 'none',
          }}
        />
      ))}
    </div>
  );
};

export default AudioBars;
