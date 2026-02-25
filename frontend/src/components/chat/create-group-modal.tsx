import { t } from 'i18next';
import { Users, X } from 'lucide-react';
import { InputField, SearchField, SubmitButton } from '../common';

interface Props {
    users: any[];
    setShowCreateGroup: (show: boolean) => void;
}

const CreateGroupModal: React.FC<Props> = ({ users, setShowCreateGroup }) => {
    return (
        <>
            <div
                className='fixed inset-0 bg-opacity-50 z-50'
                onClick={() => setShowCreateGroup(false)}
            />
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50'>
                <div className='p-6 border-b border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                            {t('create-group')}
                        </h2>
                        <button
                            onClick={() => setShowCreateGroup(false)}
                            className='p-2 hover:bg-gray-100 rounded-full transition-all'
                        >
                            <X className='w-6 h-6 text-gray-600' />
                        </button>
                    </div>
                </div>

                <div className='p-6 space-y-4'>
                    <InputField
                        label={t('group-name')}
                        value={''}
                        focusColor='ring-blue-500 focus:bg-white'
                        bgColor='bg-gray-100'
                        boderColor='border-white'
                        onChange={() => {}}
                        placeholder={t('enter-group-name')}
                        icon={Users}
                    />

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            {t('add-members')}
                        </label>
                        <div className='relative mb-3'>
                            <SearchField width='w-full' rounded='rounded-xl' focus='ring-blue-500' />
                        </div>
                        <div className='space-y-2 max-h-48 overflow-y-auto'>
                            {users.map((user) => (
                                <label
                                    key={user.id}
                                    className='flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all'
                                >
                                    <input
                                        type='checkbox'
                                        className='w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
                                    />
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className='w-10 h-10 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <p className='font-semibold text-sm text-gray-900'>
                                            {user.name}
                                        </p>
                                        <p className='text-xs text-gray-500'>
                                            {user.online ? t('user-online') : t('user-offline')}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='p-6 border-t border-gray-200 flex space-x-3'>
                    <SubmitButton
                        onClick={() => setShowCreateGroup(false)}
                        label={t('cancel')}
                        color='bg-gray-100'
                        textColor='text-gray-700'
                        scale={false}
                    />
                    <SubmitButton
                        onClick={() => {
                            setShowCreateGroup(false);
                            // Logic tạo nhóm ở đây
                        }}
                        label={t('create')}
                        color='from-blue-600 to-purple-600'
                        textColor='text-white'
                    />
                </div>
            </div>
        </>
    );
};

export default CreateGroupModal;
