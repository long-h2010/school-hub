interface Props {
  color?: string;
  size?: number;
}

const Ripple: React.FC<Props> = ({
  color = 'rgba(52,211,153,0.15)',
  size = 80,
}) => {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className='absolute rounded-full pointer-events-none'
          style={{
            width: size,
            height: size,
            border: `2px solid ${color}`,
            animation: `vcRipple 2s ease-out ${i * 0.65}s infinite`,
          }}
        />
      ))}
    </>
  );
};

export default Ripple;
