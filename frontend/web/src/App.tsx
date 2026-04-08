import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import './i18n';
import ProtectedRoute from './guards/protected-route';
import { AuthProvider } from './contexts/auth-context';
import { SocketProvider } from './contexts/socket-context';
import { CallProvider } from './contexts/call-context';
import MainLayout from './layouts/main-layout';
import AdminLayout from './layouts/admin-layout';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Messenger from './pages/messenger';
import Profile from './pages/profile';
import Dashboard from './pages/admin/dashboard';
import Analytics from './pages/admin/analytics';
import Users from './pages/admin/users';
import Moderation from './pages/admin/moderation';
import Settings from './pages/admin/settings';
import NotFound from './pages/not-found';
import { GlobalCall } from './components/videocall';

function App() {
  useEffect(() => {
    document.title = 'Hub';
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CallProvider>
          <SocketProvider>
            <Suspense>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayout />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/chat' element={<Messenger />} />
                    <Route path='/profile/:id' element={<Profile />} />
                    <Route path='/me' element={<Profile />} />
                  </Route>
                </Route>
                <Route
                  path='/admin'
                  element={<ProtectedRoute requiredRole='admin' />}
                >
                  <Route element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path='analytics' element={<Analytics />} />
                    <Route path='users' element={<Users />} />
                    <Route path='moderation' element={<Moderation />} />
                    <Route path='settings' element={<Settings />} />
                  </Route>
                </Route>
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Suspense>
            <GlobalCall />
          </SocketProvider>
        </CallProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
