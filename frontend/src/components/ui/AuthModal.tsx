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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhone(value);
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const part1 = phone.slice(0, 3);
    const part2 = phone.slice(3, 6);
    const part3 = phone.slice(6, 8);
    const part4 = phone.slice(8, 10);
    return `${part1}${part2 ? ` ${part2}` : ''}${part3 ? `-${part3}` : ''}${part4 ? `-${part4}` : ''}`;
  };

  const handleCountrySelect = (country: typeof countries[number]) => {
    setSelectedCountry(country);
    setIsCountryListOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />

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
                width={20}
                height={20}
                className="rounded-full object-cover"
              />
              <span className="text-sm">{selectedCountry.code}</span>
            </button>

            <input
              type="tel"
              id="phone"
              value={formatPhone(phone)}
              onChange={handlePhoneChange}
              className="flex-1 bg-transparent outline-none ml-2 placeholder:text-gray-400"
              placeholder="000 000-00-00"
              ref={inputRef}
            />

            {isCountryListOpen && (
              <div
                ref={countryListRef}
                className="absolute top-[60px] left-0 w-[300px] h-[400px] bg-white rounded-lg shadow-lg overflow-y-auto z-20"
              >
                <div className="p-4">
                  <h3 className="text-lg font-hauss font-medium mb-4">Код страны</h3>
                  {countries.map((country) => (
                    <button
                      key={country.name}
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Image
                        src={country.flag}
                        alt={country.name}
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <span className="font-hauss">{country.name} {country.code}</span>
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
    </div>
  );
};

export default AuthModal;