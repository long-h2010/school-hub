import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { LoginHeader, SocialLoginButton } from '../components/auth';
import { useAuth } from '../contexts/auth-context';
import { InputField, SubmitButton, Divider } from '../components/common';
import { t } from 'i18next';
import { Link } from 'react-router-dom';

declare const google: {
  accounts: {
    id: {
      initialize: (config: any) => void;
      prompt: (callback?: (notification: any) => void) => void;
    };
  };
};

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login, error } = useAuth();

  const handleLogin = async (_e: React.MouseEvent<HTMLButtonElement>) => {
    await login(import.meta.env.VITE_APP_LOGIN_ENDPOINT, {
      username,
      password,
    });
  };

  const handleGgLogin = () => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        const credential = response.credential;

        login(import.meta.env.VITE_APP_GOOGLE_LOGIN_ENDPOINT, {
          token: credential,
        });
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        google.accounts.id.prompt();
      }
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-red-600'>
          <LoginHeader />

          <div className='space-y-6'>
            <InputField
              label={t('username')}
              focusColor='ring-red-600'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='000000'
              icon={User}
            />

            <InputField
              label={t('password')}
              type='password'
              focusColor='ring-red-600'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              icon={Lock}
              showPasswordToggle={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}

            <div className='ml-auto'>
              <Link
                to='/register'
                className='text-sm text-red-600 hover:text-red-700 font-medium'
              >
                {t('register')}
              </Link>
            </div>

            <div className='flex items-center justify-between'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  className='w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500'
                />
                <span className='ml-2 text-sm text-gray-600'>
                  {t('remember')}
                </span>
              </label>
              <Link
                to='#'
                className='text-sm text-red-600 hover:text-red-700 font-medium'
              >
                {t('forgot-password')}
              </Link>
            </div>

            <SubmitButton
              onClick={handleLogin}
              label={t('login')}
              color='from-red-600 to-red-700'
              hoverColor='hover:from-red-700 hover:to-red-800'
              textColor='text-white'
            />
          </div>

          <Divider />

          <div className='mt-6'>
            <SocialLoginButton onCLick={() => handleGgLogin()} />
          </div>
        </div>
      </div>
      <script src='https://accounts.google.com/gsi/client' async defer></script>
    </div>
  );
};

export default Login;
