import React from 'react';

interface ClearCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ClearCartModal: React.FC<ClearCartModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div 
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            <div className="relative bg-white p-6 rounded-[20px] w-[90%] max-w-[425px] shadow-xl">
                <h2 className="text-xl font-semibold mb-2">Очистить корзину</h2>
                <p className="text-gray-600 mb-6">
                    Вы уверены, что хотите удалить все товары из корзины?
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-[10px] transition-all hover:bg-red-700"
                    >
                        Очистить
                    </button>
                </div>
            </div>
        </div>
    );
}; 