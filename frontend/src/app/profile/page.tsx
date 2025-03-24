"use client";

import React from "react";
import Link from "next/link";

const ProfilePage = () => {
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-gray-700">Профиль не найден.</p>
        <Link href="/" className="mt-4 text-[#A232E8] hover:text-[#AF4DFD]">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-hauss font-medium mb-4">Ваш профиль</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-lg text-gray-700">
          <span className="font-semibold">ID профиля:</span> {profile.id}
        </p>
        <p className="text-lg text-gray-700 mt-2">
          <span className="font-semibold">Номер телефона:</span> {profile.phone}
        </p>
        <p className="text-lg text-gray-700 mt-2">
          <span className="font-semibold">Имя:</span> {profile.name}
        </p>
        <p className="text-lg text-gray-700 mt-2">
          <span className="font-semibold">Пол:</span> {profile.gender}
        </p>
      </div>
      <Link href="/" className="mt-6 text-[#A232E8] hover:text-[#AF4DFD]">
        Вернуться на главную
      </Link>
    </div>
  );
};

export default ProfilePage;