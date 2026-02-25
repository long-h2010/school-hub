import { t } from 'i18next';
import { MessageSquare } from 'lucide-react';

const DefaultDisplay: React.FC = () => {
    return (
        <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
                <div className='w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl'>
                    <MessageSquare className='w-16 h-16 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-gray-800 mb-2'>{t('choose-chat.title')}</h3>
                <p className='text-gray-500'>{t('choose-chat.description')}</p>
            </div>
        </div>
    );
};

export default DefaultDisplay;
