import { Clock, TrendingUp, Heart, RssIcon } from 'lucide-react';
import type { TabType } from '../../types/post';
import { ActiveButton } from '../common/button';
import { t } from 'i18next';

interface Props {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

const MainSidebar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        {
            index: 0,
            type: 'new',
            title: t('new-post.title'),
            color: 'bg-blue-50 text-blue-600',
            icon: <Clock className='w-5 h-5' />,
        },
        {
            index: 1,
            type: 'hot',
            title: t('hot-post.title'),
            color: 'bg-orange-50 text-orange-600',
            icon: <TrendingUp className='w-5 h-5' />,
        },
        {
            index: 2,
            type: 'following',
            title: t('following-post.title'),
            color: 'bg-green-50 text-green-600',
            icon: <RssIcon className='w-5 h-5' />,
        },
        {
            index: 3,
            type: 'liked',
            title: t('liked-post.title'),
            color: 'bg-pink-50 text-pink-600',
            icon: <Heart className='w-5 h-5' />,
        },
    ];

    return (
        <aside className='fixed left-0 top-14 h-screen w-64 bg-white shadow-sm p-4 overflow-y-auto'>
            <div className='space-y-2'>
                {tabs.map((tab: any) => (
                    <ActiveButton
                        key={tab.index}
                        onClick={() => setActiveTab(tab.type)}
                        active={activeTab == tab.type}
                        title={tab.title}
                        color={tab.color}
                        icon={tab.icon}
                    />
                ))}
            </div>
        </aside>
    );
};

export default MainSidebar;
