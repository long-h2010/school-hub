import { X } from 'lucide-react';

interface Props {
    images: string[];
    xIcon?: boolean;
    removeImage?: (index: number) => void;
}

const PostshowImages: React.FC<Props> = ({ images, xIcon = false, removeImage }) => {
    const MAX_SHOW = 3;
    const showImages = images.slice(0, MAX_SHOW);
    const length = images.length;
    const showLength = showImages.length;

    const render = (src: string, index: number, height: string, row?: string) => {
        return (
            <div key={index} className={`relative rounded-lg overflow-hidden border border-gray-200 ${row}`}>
                <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className={`w-full ${height} object-cover`}
                />
                {index === MAX_SHOW - 1 && length > MAX_SHOW && (
                    <div className='absolute inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center'>
                        <span className='text-white text-3xl font-bold'>+{length - MAX_SHOW}</span>
                    </div>
                )}
                {xIcon && (
                    <button
                        onClick={() => removeImage?.(index)}
                        className='absolute top-2 right-2 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all'
                    >
                        <X className='w-4 h-4 text-gray-700' />
                    </button>
                )}
            </div>
        );
    };

    return (
        <>
            {showLength == 1 && render(showImages[0], 0, 'max-h-96')}
            {showLength == 2 && (
                <div className='grid grid-cols-2 gap-2'>
                    {showImages.map((img, i) => render(img, i, 'h-64'))}
                </div>
            )}
            {showLength == 3 && (
                <div className='grid grid-cols-2 gap-2'>
                    {render(showImages[0], 0, 'h-full', 'row-span-2')}
                    {showImages.slice(1).map((img, i) => render(img, i + 1, 'h-32'))}
                </div>
            )}
        </>
    );
};

export default PostshowImages;
