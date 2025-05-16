"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./AdminButton";
import { checkAuth } from "../../api/auth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, gender: string) => void;
  onLogout: () => void;
  onDelete: () => void;
  currentName: string;
  phoneNumber?: string;
  gender: string;
}

const EditProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  onLogout,
  onDelete,
  currentName,
  phoneNumber: propPhoneNumber,
  gender,
}) => {
  const [name, setName] = useState(currentName);
  const [selectedGender, setSelectedGender] = useState(gender);
  const [phoneNumber, setPhoneNumber] = useState(propPhoneNumber || "");

  useEffect(() => {
    setName(currentName);
    setSelectedGender(gender);
  }, [currentName, gender, isOpen]);

  useEffect(() => {
    if (isOpen) {
      checkAuth()
        .then((profile) => {
          if (profile && profile.phone) {
            setPhoneNumber(profile.phone);
          }
        })
        .catch((err) => {
          console.error("Failed to load user info:", err);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-[20px] w-full max-w-md p-6 relative shadow-lg animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Редактировать профиль</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600">Имя</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#6A11CB]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Телефон</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-200 bg-gray-100 rounded-[12px] text-gray-500"
              value={phoneNumber}
              disabled
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Пол</label>
            <div className="flex gap-6 mt-2">
              {["Мужской", "Женский"].map((option) => {
                const isSelected = selectedGender === option;
                return (
                  <div
                    key={option}
                    onClick={() => setSelectedGender(option)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-transparent bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)]"
                          : "border-gray-400"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isSelected
                          ? "text-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            onClick={() => onSave(name, selectedGender)}
            className="w-full mt-2 bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] hover:opacity-80 text-white rounded-[14px] font-medium transition"
          >
            Сохранить
          </Button>

          <Button
            onClick={onLogout}
            className="w-full border border-gray-300 text-gray-700 rounded-[14px] transition hover:bg-gray-100"
          >
            Выйти
          </Button>

          <button
            onClick={onDelete}
            className="w-full mt-3 text-sm text-red-500 hover:opacity-80"
          >
            Удалить профиль
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
