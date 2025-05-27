import { FC, useState, useEffect } from "react";
import { Minus, Plus, Heart, Trash } from "lucide-react";
import Image from "next/image";
import { DeleteFromCartModal } from "./DeleteFromCartModal";
import { deleteFromCart } from "@/api/cart";

// Заготовка для изображения-заглушки
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2QjZCNkIiPk5vIGltYWdlPC90ZXh0Pjwvc3ZnPg==';

type CartItemProps = {
    id: number;
    image: string;
    title: string;
    description: string;
    price: number;
    delivery?: string;
    cancelNote?: string;
    quantity?: number;
    onIncrease: () => void;
    onDecrease: () => void;
    selected: boolean;
    onSelect: () => void;
    className?: string;
    onDelete?: () => void;
};

export const CartItem: FC<CartItemProps> = ({
    id,
    image,
    title,
    description,
    price,
    quantity = 1,
    onIncrease,
    onDecrease,
    selected,
    onSelect,
    onDelete,
}) => {
    const [liked, setLiked] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleIncrease = () => {
        onIncrease();
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            onDecrease();
        }
    };

    const handleDelete = async () => {
        const success = await deleteFromCart(id);
        if (success && onDelete) {
            onDelete();
        }
        setIsDeleteModalOpen(false);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const discountedPrice = price - 0.03 * price;
    const crossedOutPrice = price;

    const totalDiscounted = Math.round(discountedPrice * quantity);
    const totalOriginal = Math.round(crossedOutPrice * quantity);

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-[20px] shadow-md">
                <div className="flex gap-4 flex-1 min-w-0">
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={onSelect}
                        className="w-5 h-5 rounded border-gray-300 text-[#2575FC] focus:ring-[#2575FC] flex-shrink-0"
                    />
                    <div className="relative w-[120px] h-[120px] rounded-[10px] overflow-hidden flex-shrink-0">
                        <Image
                            src={imageError ? placeholderImage : image}
                            alt={title}
                            fill
                            className="object-cover"
                            onError={handleImageError}
                        />
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                            <h3 className="text-lg font-[570] line-clamp-2">{title}</h3>
                            <h3 className="text-sm font-medium text-gray-400 line-clamp-2">{description}</h3>
                        </div>
                        <div className="flex gap-2">
                            <h3 className="text-sm font-medium text-gray-400">Завтра</h3>
                            <h3 className="text-sm font-medium text-green-700">Бесплатный отказ</h3>
                        </div>
                        <div className="flex gap-3">
                            <Heart
                                onClick={() => setLiked(!liked)}
                                className={`cursor-pointer transition-all w-6 h-6 ${liked
                                    ? "text-[#2575FC] fill-current"
                                    : "text-[#6A11CB] hover:text-[#2575FC] fill-none"
                                    }`}
                            />
                            <Trash 
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="hover:text-red-600 transition-all cursor-pointer" 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-4 flex-shrink-0 w-[200px]">
                    <div className="flex flex-col items-end">
                        <h3 className="text-sm font-medium text-transparent bg-clip-text bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)]">
                            С SL кошельком
                        </h3>
                        <div className="flex gap-3 items-end">
                            <h3 className="text-md font-semibold text-transparent bg-clip-text bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)]">
                                {totalDiscounted} ₽
                            </h3>
                            <h3 className="text-sm font-medium text-gray-400 line-through mt-1.5">
                                {totalOriginal} ₽
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 justify-center">
                        <button
                            onClick={handleDecrease}
                            className="p-1 rounded text-gray-400 hover:bg-gray-100"
                        >
                            <Minus size={16} />
                        </button>
                        <h3 className="w-6 min-w-[24px] text-center tabular-nums">{quantity}</h3>
                        <button
                            onClick={handleIncrease}
                            className="p-1 rounded text-gray-400 hover:bg-gray-100"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <DeleteFromCartModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                productName={title}
            />
        </>
    );
};
