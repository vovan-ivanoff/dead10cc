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

    const totalDiscounted = Math.round(discountedPrice * localQuantity);
    const totalOriginal = Math.round(crossedOutPrice * localQuantity);

    return (
        <div className="flex gap-4 p-4 pr-8 justify-between items-stretch max-w-[1000px] h-[180px]">
            <div className="w-[140px] h-[140px]">
                <label className="cursor-pointer w-full h-full block relative">
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={onSelect}
                        className="absolute top-1 left-1 w-6 h-6 text-[#6A11CB] accent-[#6A11CB] z-10"
                    />
                    <Image
                        src={image}
                        alt={title}
                        width={120}
                        height={120}
                        className="object-contain rounded"
                    />
                </label>
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
                            ? "text-[#2575FC] fill-current"
                            : "text-[#6A11CB] hover:text-[#2575FC] fill-none"
                            }`}
                    />
                    <Trash className="hover:text-gray-600 transition-all cursor-pointer" />
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2 w-[90px] justify-center pr-4">
                <button
                    onClick={handleDecrease}
                    className="p-1 rounded text-gray-400 hover:bg-gray-100"
                >
                    <Minus size={16} />
                </button>
                <h3 className="w-6 min-w-[24px] text-center tabular-nums">{localQuantity}</h3>
                <button
                    onClick={handleIncrease}
                    className="p-1 rounded text-gray-400 hover:bg-gray-100"
                >
                    <Plus size={16} />
                </button>
            </div>


            <div className="flex flex-col justify-center min-w-[120px]">
                <h3 className="text-sm font-medium text-transparent bg-clip-text bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] text-left">
                    С SL кошельком
                </h3>
                <div className="flex justify-center gap-3 items-end">
                    <h3 className="text-md font-semibold text-transparent bg-clip-text bg-[linear-gradient(105deg,_#6A11CB_0%,_#2575FC_100%)] w-[75px] text-left">
                        {totalDiscounted} ₽
                    </h3>
                    <h3 className="text-sm font-medium text-gray-400 line-through mt-1.5 w-[75px] text-left">
                        {totalOriginal} ₽
                    </h3>

                </div>
            </div>

        </div>
    );
};
