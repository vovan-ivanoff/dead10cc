"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { 
  sendVerificationCode,
  verifyCode,
  checkAuth,
  type Profile
} from '../../api/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (profile: Profile) => void;
}

interface Country {
  name: string;
  code: string;
  flag: string;
}

const countries = [
  { name: 'Россия', code: '+7', flag: '/assets/images/flags/russia.svg' },
  { name: 'Армения', code: '+374', flag: '/assets/images/flags/armenia.svg' },
  { name: 'Беларусь', code: '+375', flag: '/assets/images/flags/belarus.svg' },
  { name: 'Казахстан', code: '+7', flag: '/assets/images/flags/kazakhstan.svg' },
  { name: 'Киргизия', code: '+996', flag: '/assets/images/flags/kyrgyzstan.svg' },
  { name: 'Узбекистан', code: '+998', flag: '/assets/images/flags/uzbekistan.svg' },
  { name: 'Грузия', code: '+995', flag: '/assets/images/flags/georgia.svg' },
];

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onAuthSuccess
}) => {
  const [phone, setPhone] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0] as Country);
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [isCodeInputOpen, setIsCodeInputOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const countryListRef = useRef<HTMLDivElement>(null);

  const verifySession = useCallback(async () => {
    try {
      const profile = await checkAuth();
      if (profile) {
        onAuthSuccess?.(profile);
      }
    } catch {
    }
  }, [onAuthSuccess]);

  useEffect(() => {
    if (isOpen) {
      setAuthError(null);
      if (inputRef.current && !isCodeInputOpen) {
        inputRef.current.focus();
      }
    }
  }, [isOpen, isCodeInputOpen]);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const profile = await checkAuth();
        if (profile) {
          onAuthSuccess?.(profile);
        }
      } catch {
        console.log('Пользователь не авторизован');
      }
    };
  
    if (isOpen) {
      verifySession();
      setAuthError(null);
    }
  }, [isOpen, onAuthSuccess]);

  useEffect(() => {
    if (isOpen && inputRef.current && !isCodeInputOpen) {
      inputRef.current.focus();
    }
  }, [isOpen, isCodeInputOpen]);

  useEffect(() => {
    if (isOpen) {
      verifySession();
      setAuthError(null);
      if (inputRef.current && !isCodeInputOpen) {
        inputRef.current.focus();
      }
    }
  }, [isOpen, isCodeInputOpen, verifySession]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryListRef.current && !countryListRef.current.contains(e.target as Node)) {
        setIsCountryListOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const phoneFormats: { [key: string]: string } = {
    '+7': '000 000-00-00',
    '+374': '00 00-00-00',
    '+375': '00 000-00-00',
    '+996': '000 00-00-00',
    '+998': '00 000-00-00',
    '+995': '000 00 00 00',
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/\D/g, ''));
    setAuthError(null);
  };

  const formatPhone = (phone: string, countryCode: string): string => {
    if (!phone) return '';
    const format = phoneFormats[countryCode] || '000 000-00-00';
    let result = '';
    let phoneIndex = 0;

    for (const char of format) {
      if (char === '0') {
        if (phone[phoneIndex]) {
          result += phone[phoneIndex++];
        } else break;
      } else if (phone[phoneIndex]) {
        result += char;
      }
    }
    return result;
  };

  const handleCountrySelect = (country: typeof countries[number]) => {
    setSelectedCountry(country);
    setIsCountryListOpen(false);
    setAuthError(null);
  };

  const handleGetCodeClick = async () => {
    if (!isAgreed) return setAuthError('Пожалуйста, согласитесь с правилами');
    if (!phone) return setAuthError('Пожалуйста, введите номер телефона');

    setIsLoading(true);
    setAuthError(null);

    try {
      await sendVerificationCode({ phone, country_code: selectedCountry.code });
      setIsCodeInputOpen(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Ошибка при отправке кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthorization = async (phoneNumber: string, code: string[]) => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) return;
    
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const profile = await verifyCode({
        phone: phoneNumber,
        code: enteredCode
      });
      
      onAuthSuccess?.(profile); // Передаем профиль
      onClose();
      resetForm();
      window.location.reload();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Неверный код подтверждения');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsCodeInputOpen(false);
    setPhone('');
    setIsAgreed(false);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
    {/* Темный оверлей под хедером */}
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 z-40"
      style={{ 
        top: 'var(--header-height)',
        height: 'calc(100vh - var(--header-height, 114px))'
      }}
      onClick={handleCloseModal}
    />
    
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        height: 'calc(100vh - var(--header-height, 114px))'
      }}
    >
      {isCodeInputOpen ? (
        <CodeInputModal
          onClose={handleCloseModal}
          phoneNumber={`${selectedCountry.code} ${formatPhone(phone, selectedCountry.code)}`}
          onAuthorize={(code) => handleAuthorization(phone, code)}
          onResendCode={handleGetCodeClick}
          isLoading={isLoading}
          error={authError}
          onClearError={() => setAuthError(null)}
        />
      ) : (
        <div className="bg-white rounded-[20px] shadow-lg w-[420px] max-w-[95vw] relative z-10 flex flex-col justify-center pb-6 mx-4">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Закрыть"
          >
            <Image
              src="/assets/icons/close.svg"
              alt=""
              width={16}
              height={16}
            />
          </button>

          <h2 className="text-2xl font-hauss font-medium text-center mt-6">
            Войти или создать профиль
          </h2>

            <>
              <div className="mt-6 px-6">
                <div className="w-full h-[45px] bg-[#E8E8F0] rounded-[10px] flex items-center px-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#A232E8] relative">
                  <button
                    onClick={() => setIsCountryListOpen(!isCountryListOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Выбрать страну"
                  >
                    <Image
                      src={selectedCountry.flag}
                      alt=""
                      width={22}
                      height={22}
                      className="rounded-full object-cover"
                    />
                    <span className="text-lg font-book">{selectedCountry.code}</span>
                  </button>

                  <input
                    type="tel"
                    id="phone"
                    value={formatPhone(phone, selectedCountry.code)}
                    onChange={handlePhoneChange}
                    className="text-lg font-book flex-1 bg-transparent outline-none placeholder:text-gray-400"
                    placeholder={phoneFormats[selectedCountry.code]}
                    ref={inputRef}
                    aria-label="Номер телефона"
                  />

                  {isCountryListOpen && (
                    <div
                      ref={countryListRef}
                      className="absolute top-[60px] left-0 w-[300px] h-[400px] bg-white rounded-lg shadow-lg overflow-y-auto z-20"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-hauss font-medium mb-2 ml-[10px]">Код страны</h3>
                        {countries.map((country) => (
                          <button
                            key={country.name}
                            onClick={() => handleCountrySelect(country)}
                            className="w-full flex items-center gap-4 p-[11px] hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Image
                              src={country.flag}
                              alt=""
                              width={25}
                              height={25}
                              className="rounded-full object-cover"
                            />
                            <span className="font-hauss font-book">{country.name} {country.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {authError && (
                  <div className="mt-2 text-center text-red-500 text-sm">
                    {authError}
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={handleGetCodeClick}
                    disabled={isLoading}
                    className={`w-full h-[45px] bg-[#A232E8] text-white font-hauss font-medium rounded-[10px] hover:bg-[#AF4DFD] focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] transition-colors ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    aria-label="Получить код подтверждения"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Отправка...
                      </span>
                    ) : (
                      'Получить код'
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 px-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={isAgreed}
                    onChange={(e) => {
                      setIsAgreed(e.target.checked);
                      setAuthError(null);
                    }}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="agreement" className="text-sm text-gray-500">
                    Соглашаюсь {' '}
                    <a
                      href="/rules"
                      className="text-black hover:text-[#AF4DFD] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      с правилами пользования торговой площадкой
                    </a>{' '}
                    и{' '}
                    <a
                      href="/refund"
                      className="text-black hover:text-[#AF4DFD] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      возврата
                    </a>
                  </label>
                </div>
              </div>
            </>
        </div>
      )}
    </div>
    </>
  );
};

interface CodeInputModalProps {
  onClose: () => void;
  phoneNumber: string;
  onAuthorize: (code: string[]) => Promise<{ error?: boolean } | void>;
  onResendCode: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

const CodeInputModal: React.FC<CodeInputModalProps> = ({
  onClose,
  phoneNumber,
  onAuthorize,
  onResendCode,
  isLoading,
  error,
  onClearError,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setShowResend(true);
    }
  }, [timer]);

  const handleCodeChange = async (index: number, value: string) => {
    const newCode = [...code];
    
    if (error) onClearError();
    
    const digit = value.replace(/\D/g, '');
    if (digit && !/^\d$/.test(digit)) return;
    
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newCode.every(c => c) && newCode.join('').length === 6) {
      const result = await onAuthorize(newCode);
      if (result?.error) {
        setCode(Array(6).fill(''));
        inputsRef.current[0]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
    const newCode = [...code];
    
    for (let i = 0; i < Math.min(pasteData.length, 6); i++) {
      const char = pasteData[i];
      if (typeof char === 'string' && char !== '') {
        newCode[i] = char;
      } else {
        newCode[i] = '';
      }
    }
    
    setCode(newCode);
    if (pasteData.length >= 6) {
      onAuthorize(newCode);
    } else {
      const nextIndex = Math.min(pasteData.length, 5);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const handleResendCode = async () => {
    try {
      await onResendCode();
      setTimer(60);
      setShowResend(false);
      setCode(Array(6).fill(''));
      onClearError();
      inputsRef.current[0]?.focus();
    } catch (err) {
      console.error('Ошибка при повторной отправке:', err);
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-lg w-[420px] relative z-10 flex flex-col pb-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Закрыть"
      >
        <Image
          src="/assets/icons/close.svg"
          alt=""
          width={16}
          height={16}
        />
      </button>

      <h2 className="text-2xl font-hauss font-medium text-center mt-6">
        Введите код
      </h2>

      <p className="text-sm text-gray-500 text-center mt-2 px-6">
        Код отправлен на номер {phoneNumber}
      </p>

      <div className="mt-6 px-6">
        <div 
          className="flex gap-2 justify-center"
          onPaste={handlePaste}
        >
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className={`w-12 h-12 text-center text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A232E8] transition-all ${
                error ? 'border-red-500 shake-animation' : 'border-gray-300'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              aria-label={`Цифра кода ${index + 1}`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center mt-2">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6 text-center px-6">
        {showResend ? (
          <button
            onClick={handleResendCode}
            disabled={isLoading}
            className="text-sm text-[#A232E8] hover:text-[#AF4DFD] focus:outline-none transition-colors disabled:opacity-50"
          >
            Отправить код повторно
          </button>
        ) : (
          <p className="text-sm text-gray-500 whitespace-nowrap font-mono">
            Запросить код через {String(Math.floor(timer / 60)).padStart(2, '0')}:
            {String(timer % 60).padStart(2, '0')}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
