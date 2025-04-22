import { FC, useState, useEffect } from "react";
import { Minus, Plus, Heart, Trash } from "lucide-react";
import Image from "next/image";

type CartItemProps = {
    image: string;
    title: string;
    description: string;
    price: number;
    oldPrice: number;
    delivery?: string;
    cancelNote?: string;
    quantity?: number;
    onIncrease: () => void;
    onDecrease: () => void;
    selected: boolean;
    onSelect: () => void;
};

export const CartItem: FC<CartItemProps> = ({
    image,
    title,
    description,
    price,
    oldPrice,
    quantity = 1,
    onIncrease,
    onDecrease,
    selected,
    onSelect,
}) => {
    const [liked, setLiked] = useState(false);
    const [localQuantity, setLocalQuantity] = useState(quantity);

    useEffect(() => {
        setLocalQuantity(quantity);
    }, [quantity]);

    const handleIncrease = () => {
        setLocalQuantity((q) => q + 1);
        onIncrease();
    };

    const handleDecrease = () => {
        setLocalQuantity((q) => Math.max(1, q - 1));
        onDecrease();
    };

    const discountedPrice = price - 0.03 * price;
    const crossedOutPrice = price;

    return (
        <div className="flex gap-4 p-4 justify-between items-stretch max-w-[1000px] h-[180px]">
            <div className="relative w-[140px] h-[140px]">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onSelect}
                    className="absolute top-1 left-1 w-6 h-6 text-purple-600 accent-purple-600"
                />
                <Image
                    src={image}
                    alt={title}
                    width={140}
                    height={140}
                    className="object-contain rounded"
                />
            </div>

            <div className="flex flex-col justify-between flex-1 py-3 w-[600px]">
                <div>
                    <h3 className="text-lg font-[570]">{title}</h3>
                    <h3 className="text-sm font-medium text-gray-400">{description}</h3>
                </div>
                <div className="flex gap-2">
                    <h3 className="text-sm font-medium text-gray-400">Завтра</h3>
                    <h3 className="text-sm font-medium text-green-700">Бесплатный отказ</h3>
                </div>
                <div className="flex gap-3">
                    <Heart
                        onClick={() => setLiked(!liked)}
                        className={`cursor-pointer transition-all w-6 h-6 ${liked
                            ? "text-purple-500 fill-current"
                            : "text-gray-400 fill-none hover:text-purple-500"
                            }`}
                    />
                    <Trash className="hover:text-gray-600 transition-all" />
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
                <button onClick={handleDecrease} className="p-1 rounded text-gray-400 hover:bg-gray-100">
                    <Minus size={16} />
                </button>
                <h3 className="mt-1.5">{localQuantity}</h3>
                <button onClick={handleIncrease} className="p-1 rounded text-gray-400 hover:bg-gray-100">
                    <Plus size={16} />
                </button>
            </div>

            <div className="flex flex-col justify-center items-center">
                <h3 className="text-sm font-medium text-purple-600">С WB кошельком</h3>
                <div className="flex justify-center gap-1 items-center">
                    <h3 className="text-md font-semibold text-purple-600">{discountedPrice * localQuantity} ₽</h3>
                    <h3 className="text-sm font-medium text-gray-400 line-through mt-1.5">
                        {(crossedOutPrice * localQuantity).toFixed(2)} ₽
                    </h3>
                </div>
            </div>
        </div>
    );
};
