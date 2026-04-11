import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import './i18n';
import ProtectedRoute from './guards/protected-route';
import { AuthProvider } from './contexts/auth-context';
import { SocketProvider } from './contexts/socket-context';
import { CallProvider } from './contexts/call-context';
import MainLayout from './layouts/main-layout';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Messenger from './pages/messenger';
import Profile from './pages/profile';
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
