import { useEffect, useRef, useState } from 'react';
import type { User } from '../../types/user';
import AxiosClient from '../../api/axios-client';

interface UpdateProfileModalProps {
  profile: User;
  onClose: () => void;
  onUpdated: (updatedUser: User) => void;
}

const UpdateProfileModal = ({
  profile,
  onClose,
  onUpdated,
}: UpdateProfileModalProps) => {
  const [name, setName] = useState(profile.name ?? '');
  const [bio, setBio] = useState(profile.bio ?? '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    profile.avatar ?? '',
  );
  const [coverPreview, setCoverPreview] = useState<string>(
    profile.coverPhoto ?? '',
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'avatar') {
      setAvatarFile(file);
      setAvatarPreview(url);
    } else {
      setCoverFile(file);
      setCoverPreview(url);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Tên không được để trống.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (avatarFile) formData.append('avatar', avatarFile);
      if (coverFile) formData.append('coverPhoto', coverFile);

      const res = await AxiosClient.patch(
        `${import.meta.env.VITE_APP_USER_ENDPOINT}/`,
        formData,
        // không cần set Content-Type, axios tự xử lý multipart
      );
      onUpdated(res.data);
      onClose();
    } catch (err) {
      setError('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <h2 className='text-lg font-bold text-gray-900'>
            Chỉnh sửa trang cá nhân
          </h2>
          <button
            onClick={onClose}
            className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500'
          >
            ✕
          </button>
        </div>

        <div className='overflow-y-auto max-h-[75vh]'>
          {/* Cover photo */}
          <div
            className='relative h-36 bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer group'
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview && (
              <img
                src={coverPreview}
                alt='Cover'
                className='w-full h-full object-cover opacity-80'
              />
            )}
            <div className='absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity'>
              <div className='bg-white/90 rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-800'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                Đổi ảnh bìa
              </div>
            </div>
            <input
              ref={coverInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(e) => handleFileChange(e, 'cover')}
            />

            {/* Avatar on cover */}
            <div
              className='absolute -bottom-10 left-6 cursor-pointer group/avatar'
              onClick={(e) => {
                e.stopPropagation();
                avatarInputRef.current?.click();
              }}
            >
              <div className='relative w-20 h-20'>
                <img
                  src={avatarPreview}
                  alt='Avatar'
                  className='w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover'
                />
                <div className='absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                    />
                  </svg>
                </div>
              </div>
              <input
                ref={avatarInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => handleFileChange(e, 'avatar')}
              />
            </div>
          </div>

          {/* Form fields */}
          <div className='px-6 pt-14 pb-6 space-y-4'>
            {/* Name */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Tên hiển thị <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder='Nhập tên của bạn...'
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-sm transition-all'
              />
              <p className='text-xs text-gray-400 mt-1 text-right'>
                {name.length}/60
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Tiểu sử
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                placeholder='Giới thiệu ngắn về bản thân...'
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-800 text-sm transition-all resize-none'
              />
              <p className='text-xs text-gray-400 mt-1 text-right'>
                {bio.length}/160
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-4 h-4 flex-shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50'>
          <button
            onClick={onClose}
            disabled={loading}
            className='px-5 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50'
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className='px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm disabled:opacity-60 flex items-center gap-2'
          >
            {loading && (
              <svg
                className='w-4 h-4 animate-spin'
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
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v8H4z'
                />
              </svg>
            )}
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal { animation: modal-in 0.22s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
    </div>
  );
};

export default UpdateProfileModal;
