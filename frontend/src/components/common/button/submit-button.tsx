interface Props {
    width?: string
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    label: string;
    color?: string;
    hoverColor?: string;
    textSize?: string;
    textColor?: string;
    scale?: boolean;
    isLoading?: boolean;
}

const SubmitButton: React.FC<Props> = ({
    width = 'w-full',
    onClick,
    label,
    color,
    hoverColor,
    textSize,
    textColor,
    scale = true,
    isLoading = false
}) => {
    return (
        <button
            type='submit'
            onClick={onClick}
            className={`${width} flex bg-gradient-to-r ${color} ${textSize} ${textColor} py-3 items-center justify-center rounded-lg font-semibold 
                ${hoverColor} transform ${
                scale ? 'hover:scale-105' : 'hover:bg-gray-200'
            } transition duration-200 shadow-lg`}
        >
            {isLoading ? (
                    <svg
                        className='animate-spin h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                    >
                        <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                        ></circle>
                        <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                    </svg>
            ) : (
                <span>{label}</span>
            )}
        </button>
    );
};

export default SubmitButton;
