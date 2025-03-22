import React from "react";
import Container from "./Container";
import "../app/globals.css";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-200 h-[400px] w-full overflow-hidden">
            <Container>
                <div className="w-[1200px] grid grid-cols-5 gap-8 text-gray-600 overflow-hidden whitespace-nowrap mt-14">
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
                        <img src="/qr1.svg" alt="QR Code" className="w-40 h-40" />
                        <div className="flex gap-3 mt-4 flex-nowrap">
                            {["vk", "git", "tg", "yt"].map((icon) => (
                                <div key={icon} className="w-12 h-12 bg-white rounded-lg flex items-center justify-center relative group">
                                    <img src={`/icons/icon${icon}.svg`} alt={`Icon ${icon}`} className="w-8 h-8 group-hover:hidden" />
                                    <img src={`/icons/icon${icon}h.svg`} alt={`Icon ${icon} hover`} className="absolute w-9 h-9 group-hover:block hidden" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-[400px] h-[100px] break-words">
                        <h3 className="flex">
                            © Wildberries 2004-2025. Все права защищены. <br />
                            Применяются рекомендательные технологии
                        </h3>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
