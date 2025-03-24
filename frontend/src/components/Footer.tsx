import React from "react";
import Container from "./Container";
import "../app/globals.css";
import Image from 'next/image';

const Footer: React.FC = () => {
    const socialLinks: Record<string, string> = {
        vk: "https://vk.com",
        git: "https://github.com",
        tg: "https://t.me",
        yt: "https://youtube.com",
    };

    return (
        <footer className="bg-gray-200 h-[400px] w-full overflow-hidden">
            <Container>
                <div className="hidden lg:grid min-w-[1230px] max-w-[1230px] grid grid-cols-5 gap-8 text-gray-600 whitespace-nowrap mt-14 overflow-hidden">
                    <div className="space-y-2 w-[200px]">
                        <h3 className="font-black">Покупателям</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Вопросы и ответы</a></li>
                            <li><a href="#" className="hover:underline">Юридическая информация</a></li>
                        </ul>
                    </div>
                    <div className="space-y-2 w-[200px]">
                        <h3 className="font-black">Продавцам и партнёрам</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Продавать товары</a></li>
                            <li><a href="#" className="hover:underline">Открыть пункт выдачи</a></li>
                            <li><a href="#" className="hover:underline">Предложить помещение</a></li>
                            <li><a href="#" className="hover:underline">Развозить грузы</a></li>
                            <li><a href="#" className="hover:underline">Доставлять заказ</a></li>
                        </ul>
                    </div>
                    <div className="space-y-2 w-[200px]">
                        <h3 className="font-black">Наши проекты</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">WB Guru</a></li>
                            <li><a href="#" className="hover:underline">WB Stream</a></li>
                        </ul>
                    </div>
                    <div className="space-y-2 w-[200px]">
                        <h3 className="font-black">Компания</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">О нас</a></li>
                            <li><a href="#" className="hover:underline">Пресс-служба</a></li>
                            <li><a href="#" className="hover:underline">Контакты</a></li>
                            <li><a href="#" className="hover:underline">Вакансии</a></li>
                            <li><a href="#" className="hover:underline">Сообщить о мошенничестве</a></li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center justify-center w-[200px]">
                    <Image
                    src="/pictures/qr1_1.svg"
                    alt="QR Code"
                    width={160}
                    height={160}
                    className="w-40 h-40"
                    />
                        <div className="flex gap-3 mt-4 flex-nowrap">
                            {["vk", "git", "tg", "yt"].map((icon) => (
                                <a
                                    key={icon}
                                    href={socialLinks[icon]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center relative group"
                                >
                                    <Image
                                        src={`/icons/icon${icon}.svg`}
                                        alt={`Icon ${icon}`}
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 group-hover:scale-95 group-hover:opacity-0 transition-all duration-300 ease-in-out"
                                    />
                                    <Image
                                        src={`/icons/icon${icon}h.svg`}
                                        alt={`Icon ${icon} hover`}
                                        width={28}
                                        height={28}
                                        className="absolute top-0 left-0 w-7 h-7 group-hover:scale-100 group-hover:opacity-100 opacity-0 transform transition-all duration-300 ease-in-out"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="w-[400px] h-[100px]">
                        <h3 className="flex">
                            © Wildberries 2004-2025. Все права защищены.
                        </h3>
                        <div>
                            <span>Применяются </span>
                            <a
                                className="hover:underline whitespace-nowrap inline-block"
                                href="https://github.com/vovan-ivanoff/dead10cc"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                рекомендательные технологии
                            </a>
                        </div>
                    </div>
                </div>
                <div className="lg:hidden flex flex-col items-center mt-10 text-gray-600">
                    <div className="flex flex-col items-center justify-center w-[200px]">
                        <Image
                        src="/pictures/qr1_1.svg"
                        alt="QR Code"
                        width={160}
                        height={160}
                        className="w-40 h-40"
                        />
                        <div className="flex gap-3 mt-4 flex-nowrap">
                            {["vk", "git", "tg", "yt"].map((icon) => (
                                <a
                                    key={icon}
                                    href={socialLinks[icon]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center relative group"
                                >
                                    <Image
                                        src={`/icons/icon${icon}.svg`}
                                        alt={`Icon ${icon}`}
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 group-hover:scale-95 group-hover:opacity-0 transition-all duration-300 ease-in-out"
                                    />
                                    <Image
                                        src={`/icons/icon${icon}h.svg`}
                                        alt={`Icon ${icon} hover`}
                                        width={28}
                                        height={28}
                                        className="absolute w-7 h-7 group-hover:scale-100 group-hover:opacity-100 opacity-0 transform transition-all duration-300 ease-in-out"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="w-full text-center mt-10">
                        <h3 className="flex">
                            © Wildberries 2004-2025. Все права защищены.
                        </h3>
                        <div>
                            <span>Применяются </span>
                            <a
                                className="hover:underline whitespace-nowrap inline-block"
                                href="https://github.com/vovan-ivanoff/dead10cc"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                рекомендательные технологии
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;