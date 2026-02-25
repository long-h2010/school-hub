import { Outlet } from 'react-router-dom';
import { AdminSidebar, AdminHeader } from '../components/layout';
import { useState } from 'react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    
    return (
         <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex'>
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {sidebarOpen && (
                <div
                    className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200'
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className='flex-1 flex flex-col min-h-screen lg:ml-72'>
                <AdminHeader setSidebarOpen={setSidebarOpen} />

                <main className='flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
