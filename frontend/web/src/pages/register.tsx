import { useState } from 'react';
import { LoginHeader } from '../components/auth';
import { InputField, SubmitButton } from '../components/common';
import { t } from 'i18next';
import { Lock, Mail, User } from 'lucide-react';
import AxiosClient from '../api/axios-client';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleRegister = async () => {
    await AxiosClient.post(import.meta.env.VITE_APP_REGISTER_ENDPOINT, {
      username,
      name,
      email,
      password,
      confirmPassword,
    })
      .then(() => {
        setSuccess('Register successfull');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      })
      .catch((e) => setError(e.response.data.message));
  };

  return (
    <>
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
                label={t('name')}
                focusColor='ring-red-600'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Nguyen Van A'
                icon={User}
              />

              <InputField
                label={t('email')}
                focusColor='ring-red-600'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='example@gmail.com'
                icon={Mail}
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

              <InputField
                label={t('confirm-password')}
                type='password'
                focusColor='ring-red-600'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='••••••••'
                icon={Lock}
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
              {success && (
                <p className='mt-1 text-sm text-green-500'>{success}</p>
              )}

              <div className=''>
                <Link
                  to='/login'
                  className='text-sm text-red-600 hover:text-red-700 font-medium'
                >
                  {t('login')}
                </Link>
              </div>

              <SubmitButton
                onClick={handleRegister}
                label={t('register')}
                color='from-red-600 to-red-700'
                hoverColor='hover:from-red-700 hover:to-red-800'
                textColor='text-white'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
