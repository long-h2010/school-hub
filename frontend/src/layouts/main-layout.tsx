import { Outlet } from 'react-router-dom';
import { MainHeader } from '../components/layout';

const MainLayout = () => {
    return (
        <div className='min-h-screen bg-gray-100'>
            <MainHeader />
            <Outlet />
        </div>
    );
};

export default MainLayout;
