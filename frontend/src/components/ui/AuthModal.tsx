"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const countries = [
  { name: 'Россия', code: '+7', flag: '/flags/russia.svg' },
  { name: 'Армения', code: '+374', flag: '/flags/armenia.svg' },
  { name: 'Беларусь', code: '+375', flag: '/flags/belarus.svg' },
  { name: 'Казахстан', code: '+7', flag: '/flags/kazakhstan.svg' },
  { name: 'Киргизия', code: '+996', flag: '/flags/kyrgyzstan.svg' },
  { name: 'Узбекистан', code: '+998', flag: '/flags/uzbekistan.svg' },
  { name: 'Грузия', code: '+995', flag: '/flags/georgia.svg' },
];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [isCodeInputOpen, setIsCodeInputOpen] = useState(false);
  const [profile, setProfile] = useState<{ id: string; phone: string; name: string; gender: string } | null>(null); // Исправлено
  const inputRef = useRef<HTMLInputElement>(null);
  const countryListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
  };

  const formatPhone = (phone: string, countryCode: string) => {
    if (!phone) return '';

    const format = phoneFormats[countryCode] || '000 000-00-00';

    let formattedPhone = '';
    let phoneIndex = 0;

    for (let i = 0; i < format.length; i++) {
      if (format[i] === '0') {
        if (phone[phoneIndex]) {
          formattedPhone += phone[phoneIndex];
          phoneIndex++;
        } else {
          break;
        }
      } else {
        if (phone[phoneIndex]) {
          formattedPhone += format[i];
        }
      }
    }

    return formattedPhone;
  };

  const handleCountrySelect = (country: typeof countries[number]) => {
    setSelectedCountry(country);
    setIsCountryListOpen(false);
  };

  const handleGetCodeClick = () => {
    setIsCodeInputOpen(true);
  };

  const handleCloseModal = () => {
    setIsCodeInputOpen(false);
    onClose();
  };

  const generateRandomId = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleAuthorization = (phoneNumber: string) => {
    const profileId = generateRandomId();
    const newProfile = {
      id: profileId,
      phone: phoneNumber,
      name: "Иван Иванов",
      gender: "Мужской",
    };

    // Сохраняем профиль в localStorage
    localStorage.setItem('profile', JSON.stringify(newProfile));
    
    // Обновляем состояние профиля для отображения в интерфейсе
    setProfile(newProfile);
    onClose(); // Закрываем модальное окно после авторизации
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={handleCloseModal}
      />

      {isCodeInputOpen ? (
        <CodeInputModal
          onClose={handleCloseModal}
          phoneNumber={`${selectedCountry.code} ${formatPhone(phone, selectedCountry.code)}`}
          onAuthorize={handleAuthorization}
        />
      ) : (
        <div className="bg-white rounded-[20px] shadow-lg w-[420px] h-[330px] relative z-10 flex flex-col justify-center">
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Image
              src="/icons/close.svg"
              alt="Закрыть"
              width={16}
              height={16}
            />
          </button>

          <h2 className="text-2xl font-hauss font-medium text-center mt-[15px]">
            Войти или создать профиль
          </h2>

          <div className="mt-[25px] flex justify-center">
            <div className="w-[330px] h-[45px] bg-[#E8E8F0] rounded-[10px] flex items-center px-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#A232E8] relative">
              <button
                onClick={() => setIsCountryListOpen(!isCountryListOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Image
                  src={selectedCountry.flag}
                  alt={selectedCountry.name}
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
                          alt={country.name}
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
          </div>

          <div className="mt-[25px] flex justify-center">
            <button
              type="submit"
              onClick={handleGetCodeClick}
              className="w-[330px] h-[45px] bg-[#A232E8] text-white font-hauss font-medium rounded-[10px] hover:bg-[#AF4DFD] focus:outline-none focus:ring-2 focus:ring-[#8A2BE2]"
            >
              Получить код
            </button>
          </div>

          <div className="mt-[25px] flex justify-center">
            <div className="w-[330px] flex items-center">
              <input
                type="checkbox"
                id="agreement"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="agreement" className="text-sm text-gray-500">
                Соглашаюсь {' '}
                <a
                  href="/rules"
                  className="text-black hover:text-[#AF4DFD]"
                >
                  c правилами пользования торговой площадкой
                </a>{' '}
                и{' '}
                <a
                  href="/refund"
                  className="text-black hover:text-[#AF4DFD]"
                >
                  возврата
                </a>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CodeInputModal: React.FC<{
  onClose: () => void;
  phoneNumber: string;
  onAuthorize: (phoneNumber: string) => void;
}> = ({ onClose, phoneNumber, onAuthorize }) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const [isError, setIsError] = useState(false);
  const correctCode = '123123';

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

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    setIsError(false);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    if (newCode.join('').length === 6) {
      const enteredCode = newCode.join('');
      if (enteredCode === correctCode) {
        onAuthorize(phoneNumber);
      } else {
        setIsError(true);
      }
    }
  };

  const handleResendCode = () => {
    setTimer(60);
    setShowResend(false);
  };

  return (
    <div className="bg-white rounded-[20px] shadow-lg w-[420px] h-[330px] relative z-10 flex flex-col justify-center">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Image
          src="/icons/close.svg"
          alt="Закрыть"
          width={16}
          height={16}
        />
      </button>

      <h2 className="text-2xl font-hauss font-medium text-center mt-[15px]">
        Введите код
      </h2>

      <p className="text-sm text-gray-500 text-center mt-2">
        Отправили на номер {phoneNumber}
      </p>

      <div className="mt-[25px] flex justify-center">
        <div className="flex gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              className={`w-12 h-12 text-center text-2xl border ${
                isError ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A232E8]`}
            />
          ))}
        </div>
      </div>

      {isError && (
        <p className="text-sm text-red-500 text-center mt-2">
          Неверный код, попробуйте еще раз
        </p>
      )}

      <div className="mt-4 text-center w-full">
        {showResend ? (
          <button
            onClick={handleResendCode}
            className="text-sm text-[#A232E8] hover:text-[#AF4DFD] focus:outline-none"
          >
            Запросите код повторно
          </button>
        ) : (
          <p className="text-sm text-gray-500 whitespace-nowrap font-mono">
            Запросить новый код через {String(Math.floor(timer / 60)).padStart(2, '0')}:
            {String(timer % 60).padStart(2, '0')}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;