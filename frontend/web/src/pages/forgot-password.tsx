import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  Loader,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import AxiosClient from '../api/axios-client';
import { InputField } from '../components/common';

type Step =
  | 'request'
  | 'sending'
  | 'otp'
  | 'verifying'
  | 'reset'
  | 'resetting'
  | 'success'
  | 'error';

const OTP_LENGTH = 6;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  // ─── State ────────────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('request');
  const [errorMsg, setErrorMsg] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [resetToken, setResetToken] = useState(''); // token trả về sau verify OTP
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Countdown ────────────────────────────────────────────────────────────
  const startCountdown = () => {
    setResendCountdown(60);
    countdownRef.current = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  useEffect(() => () => clearInterval(countdownRef.current!), []);

  // ─── Step 1: Send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg(t('invalid-email') || 'Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setStep('sending');
    try {
      await AxiosClient.post(import.meta.env.VITE_APP_SEND_OTP_ENDPOINT, {
        email,
      });
      setOtp(Array(OTP_LENGTH).fill(''));
      setStep('otp');
      startCountdown();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          t('something-went-wrong') ||
          'Something went wrong.',
      );
      setStep('error');
    }
  };

  // ─── OTP input ────────────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setErrorMsg('');
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ─── Step 2: Verify OTP → nhận token để reset pass ────────────────────────
  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < OTP_LENGTH) {
      setErrorMsg('Please enter all 6 digits.');
      return;
    }
    setErrorMsg('');
    setStep('verifying');
    try {
      const res = await AxiosClient.post(
        import.meta.env.VITE_APP_VERIFY_OTP_ENDPOINT,
        {
          email,
          otp: otpValue,
        },
      );
      setResetToken(res.data?.accessToken ?? '');
      setStep('reset');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Invalid or expired OTP.');
      setStep('otp');
    }
  };

  // ─── Step 3: Reset Password ───────────────────────────────────────────────
  const handleResetPassword = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (newPassword.length < 8) {
      setErrorMsg(
        t('password-min-length') || 'Password must be at least 8 characters.',
      );
      return;
    }
    if (newPassword !== confirmPass) {
      setErrorMsg(t('passwords-do-not-match') || 'Passwords do not match.');
      return;
    }
    setErrorMsg('');
    setStep('resetting');
    console.log(resetToken)
    try {
      await AxiosClient.post(import.meta.env.VITE_APP_RESET_PASSWORD_ENDPOINT, {
        resetToken: resetToken,
        newPassword,
      });
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to reset password.');
      setStep('reset');
    }
  };

  const otpFilled = otp.every(Boolean);

  // ─── Shared back button ───────────────────────────────────────────────────
  const BackButton = ({
    onClick,
    label,
  }: {
    onClick: () => void;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors mb-6 group'
    >
      <ArrowLeft
        size={16}
        className='group-hover:-translate-x-1 transition-transform'
      />
      {label}
    </button>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-red-600'>
          {/* ── STEP: request / error ── */}
          {(step === 'request' || step === 'error') && (
            <>
              <Link
                to='/login'
                className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors mb-6 group'
              >
                <ArrowLeft
                  size={16}
                  className='group-hover:-translate-x-1 transition-transform'
                />
                {t('back-to-login') || 'Back to Login'}
              </Link>
              <div className='mb-8'>
                <div className='w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4'>
                  <Mail className='text-red-600' size={28} />
                </div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {t('forgot-password') || 'Forgot Password'}
                </h1>
                <p className='text-sm text-gray-500 mt-1'>
                  {t('forgot-password-desc') ||
                    "Enter your email and we'll send you an OTP code."}
                </p>
              </div>
              <div className='space-y-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                    Email
                  </label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                      <Mail size={18} />
                    </span>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg('');
                        if (step === 'error') setStep('request');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                      placeholder='example@email.com'
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none transition-all
                      focus:ring-2 focus:ring-red-600 focus:border-transparent
                      ${errorMsg ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
                    />
                  </div>
                  {errorMsg && (
                    <p className='mt-1.5 text-xs text-red-500'>{errorMsg}</p>
                  )}
                </div>
                <button
                  onClick={handleSendOtp}
                  className='w-full py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-red-600 to-red-700
                  hover:from-red-700 hover:to-red-800 active:scale-[0.98] transition-all shadow-md shadow-red-200'
                >
                  {t('send-otp') || 'Send OTP'}
                </button>
              </div>
            </>
          )}

          {/* ── STEP: sending ── */}
          {step === 'sending' && (
            <div className='flex flex-col items-center justify-center py-10 gap-4'>
              <Loader className='animate-spin text-red-600' size={36} />
              <p className='text-sm text-gray-500'>
                {t('sending') || 'Sending OTP...'}
              </p>
            </div>
          )}

          {/* ── STEP: otp / verifying ── */}
          {(step === 'otp' || step === 'verifying') && (
            <>
              <BackButton
                onClick={() => {
                  setStep('request');
                  setErrorMsg('');
                  setOtp(Array(OTP_LENGTH).fill(''));
                }}
                label={t('change-email') || 'Change email'}
              />
              <div className='mb-8'>
                <div className='w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4'>
                  <ShieldCheck className='text-red-600' size={28} />
                </div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {t('enter-otp') || 'Enter OTP'}
                </h1>
                <p className='text-sm text-gray-500 mt-1'>
                  {t('otp-sent-to') || 'We sent a 6-digit code to'}{' '}
                  <span className='font-semibold text-gray-700'>{email}</span>
                </p>
              </div>
              <div
                className='flex gap-3 justify-center mb-6'
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    disabled={step === 'verifying'}
                    className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                    focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:opacity-50
                    ${digit ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 bg-gray-50'}
                    ${errorMsg ? 'border-red-400' : ''}`}
                  />
                ))}
              </div>
              {errorMsg && (
                <p className='text-center text-xs text-red-500 mb-4'>
                  {errorMsg}
                </p>
              )}
              <button
                onClick={handleVerifyOtp}
                disabled={!otpFilled || step === 'verifying'}
                className='w-full py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-red-600 to-red-700
                hover:from-red-700 hover:to-red-800 active:scale-[0.98] transition-all shadow-md shadow-red-200
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {step === 'verifying' ? (
                  <>
                    <Loader size={16} className='animate-spin' />
                    {t('verifying') || 'Verifying...'}
                  </>
                ) : (
                  t('verify-otp') || 'Verify OTP'
                )}
              </button>
              <div className='text-center mt-5'>
                {resendCountdown > 0 ? (
                  <p className='text-sm text-gray-400'>
                    {t('resend-in') || 'Resend in'}{' '}
                    <span className='font-semibold text-gray-600'>
                      {resendCountdown}s
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={() => handleSendOtp()}
                    className='text-sm text-red-600 hover:text-red-700 font-medium'
                  >
                    {t('resend-otp') || 'Resend OTP'}
                  </button>
                )}
              </div>
            </>
          )}

          {/* ── STEP: reset password ── */}
          {(step === 'reset' || step === 'resetting') && (
            <>
              <div className='mb-8'>
                <div className='w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4'>
                  <Lock className='text-red-600' size={28} />
                </div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {t('reset-password') || 'Reset Password'}
                </h1>
                <p className='text-sm text-gray-500 mt-1'>
                  {t('reset-password-desc') || 'Enter your new password below.'}
                </p>
              </div>
              <div className='space-y-5'>
                <InputField
                  label={t('new-password') || 'New Password'}
                  type='password'
                  focusColor='ring-red-600'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='••••••••'
                  icon={Lock}
                  showPasswordToggle={true}
                  showPassword={showNew}
                  onTogglePassword={() => setShowNew(!showNew)}
                />

                <InputField
                  label={t('confirm-password') || 'Confirm Password'}
                  type='password'
                  focusColor='ring-red-600'
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder='••••••••'
                  icon={Lock}
                  showPasswordToggle={true}
                  showPassword={showConfirm}
                  onTogglePassword={() => setShowConfirm(!showConfirm)}
                />

                {/* Password match indicator */}
                {confirmPass && (
                  <p
                    className={`text-xs font-medium ${newPassword === confirmPass ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {newPassword === confirmPass
                      ? '✓ ' + (t('passwords-match') || 'Passwords match')
                      : '✗ ' +
                        (t('passwords-do-not-match') ||
                          'Passwords do not match')}
                  </p>
                )}

                {errorMsg && <p className='text-xs text-red-500'>{errorMsg}</p>}

                <button
                  onClick={handleResetPassword}
                  disabled={step === 'resetting'}
                  className='w-full py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-red-600 to-red-700
                  hover:from-red-700 hover:to-red-800 active:scale-[0.98] transition-all shadow-md shadow-red-200
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {step === 'resetting' ? (
                    <>
                      <Loader size={16} className='animate-spin' />
                      {t('resetting') || 'Resetting...'}
                    </>
                  ) : (
                    t('reset-password') || 'Reset Password'
                  )}
                </button>
              </div>
            </>
          )}

          {/* ── STEP: success ── */}
          {step === 'success' && (
            <div className='flex flex-col items-center justify-center py-8 gap-4 text-center'>
              <div className='w-16 h-16 bg-green-50 rounded-full flex items-center justify-center'>
                <CheckCircle className='text-green-500' size={36} />
              </div>
              <div>
                <p className='font-semibold text-gray-900 text-lg'>
                  {t('password-reset-success') || 'Password Reset!'}
                </p>
                <p className='text-sm text-gray-500 mt-1'>
                  {t('password-reset-success-desc') ||
                    'Your password has been reset successfully.'}
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className='mt-2 w-full py-3 rounded-xl font-semibold text-white text-sm text-center
                  bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
                  active:scale-[0.98] transition-all shadow-md shadow-red-200'
              >
                {t('back-to-login') || 'Back to Login'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
