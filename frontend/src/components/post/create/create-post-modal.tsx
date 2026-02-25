import { X, Globe, Smile, Users, MapPin, Image } from 'lucide-react';
import { SubmitButton } from '../../common';
import { useEffect, useState } from 'react';
import type { NewPost } from '../../../types/post';
import { PostImages } from '../card';

interface Props {
    avatar: string;
    isOpen: boolean;
    onClose: () => void;
    updatePost: <K extends keyof NewPost>(key: K, value: NewPost[K]) => void;
    onCreatePost: () => void;
}

const CreatePostModal: React.FC<Props> = ({
    avatar,
    isOpen,
    onClose,
    updatePost,
    onCreatePost,
}) => {
    const [isPosting, setIsPosting] = useState(false);
    const [newPostContent, setPostContent] = useState<string>('');
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [imageFiles, setImagesFiles] = useState<File[]>([]);
    const activeSubmit = newPostContent || uploadedImages.length > 0;

    useEffect(() => updatePost('content', newPostContent), [newPostContent]);
    useEffect(() => updatePost('images', imageFiles), [imageFiles]);

    if (!isOpen) return null;

    const handlePost = async () => {
        setIsPosting(true);
        await onCreatePost();
        setPostContent('');
        setUploadedImages([]);
        setImagesFiles([]);
        setIsPosting(false);
        onClose();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setImagesFiles((prev) => [...prev, ...files])
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                console.log(reader);
                reader.onloadend = () => {
                    setUploadedImages((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
        setImagesFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <div
                className='fixed inset-0 backdrop-blur-sm bg-white/10 bg-opacity-50 z-50'
                onClick={onClose}
            />
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-xl z-50'>
                <div className='flex items-center justify-between p-4 border-b'>
                    <h2 className='text-xl font-bold'>Tạo bài viết</h2>
                    <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-full'>
                        <X className='w-6 h-6 text-gray-600' />
                    </button>
                </div>

                <div className='p-4'>
                    <div className='flex items-center space-x-3 mb-4'>
                        <img src={avatar} alt='Avatar' className='w-10 h-10 rounded-full' />
                        <div>
                            <h3 className='font-semibold text-sm'>Bạn</h3>
                            <button className='flex items-center space-x-1 bg-gray-200 px-2 py-1 rounded text-xs'>
                                <Globe className='w-3 h-3' />
                                <span>Công khai</span>
                            </button>
                        </div>
                    </div>

                    <textarea
                        placeholder='Bạn đang nghĩ gì?'
                        className='w-full min-h-32 text-lg outline-none resize-none'
                        value={newPostContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        autoFocus
                    />

                    {uploadedImages.length > 0 && (
                        <div className='mt-4'>
                            <PostImages images={uploadedImages} xIcon={true} removeImage={removeImage} />
                        </div>
                    )}

                    <div className='flex justify-end mt-2'>
                        <button className='p-2 hover:bg-gray-100 rounded-full'>
                            <Smile className='w-6 h-6 text-gray-500' />
                        </button>
                    </div>
                </div>

                <div className='px-4 pb-4'>
                    <div className='border rounded-lg p-3'>
                        <div className='flex items-center justify-between'>
                            <span className='font-medium text-sm'>Thêm vào bài viết</span>
                            <div className='flex space-x-2'>
                                <label className='p-2 hover:bg-gray-100 rounded-full cursor-pointer'>
                                    <Image className='w-5 h-5 text-green-500' />
                                    <input
                                        type='file'
                                        accept='image/*'
                                        multiple
                                        onChange={handleImageUpload}
                                        className='hidden'
                                    />
                                </label>
                                <button className='p-2 hover:bg-gray-100 rounded-full'>
                                    <Users className='w-5 h-5 text-blue-500' />
                                </button>
                                <button className='p-2 hover:bg-gray-100 rounded-full'>
                                    <Smile className='w-5 h-5 text-yellow-500' />
                                </button>
                                <button className='p-2 hover:bg-gray-100 rounded-full'>
                                    <MapPin className='w-5 h-5 text-red-500' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='px-4 pb-4'>
                    <SubmitButton
                        onClick={handlePost}
                        label='Đăng'
                        color={activeSubmit ? 'bg-blue-600' : 'bg-gray-200 cursor-not-allowed'}
                        hoverColor={activeSubmit ? 'hover:bg-blue-700' : ''}
                        textColor='text-white'
                        isLoading={isPosting}
                    />
                </div>
            </div>
        </>
    );
};

export default CreatePostModal;
