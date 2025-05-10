import React from "react";
import Container from "./Container";
import "../../styles/globals.css";
import Image from 'next/image';

const Footer: React.FC = () => {
    const socialLinks: Record<string, string> = {
        vk: "https://vk.com",
        git: "https://github.com",
        tg: "https://t.me",
        yt: "https://youtube.com",
    };

    return (
        <footer className="bg-transparent w-full py-8">
            <Container>
                <div className="flex flex-col items-center gap-6">
                    <div className="flex justify-center">
                        <Image
                            src="/assets/images/pictures/qr1_1.svg"
                            alt="QR Code"
                            width={120}
                            height={120}
                            className="w-30 h-30"
                        />
                    </div>

                    <div className="flex gap-3 flex-nowrap">
                        {["vk", "git", "tg", "yt"].map((icon) => (
                            <a
                                key={icon}
                                href={socialLinks[icon]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg flex items-center justify-center relative group"
                            >
                                <Image
                                    src={`/assets/icons/icon${icon}.svg`}
                                    alt={`${icon} icon`}
                                    width={20}
                                    height={20}
                                    className="w-6 h-6 group-hover:scale-95 group-hover:opacity-0 transition-all duration-300 ease-in-out"
                                />
                                <Image
                                    src={`/assets/icons/icon${icon}h.svg`}
                                    alt={`Icon ${icon} hover`}
                                    width={28}
                                    height={28}
                                    className="absolute w-7 h-7 group-hover:scale-100 group-hover:opacity-100 opacity-0 transform transition-all duration-300 ease-in-out"
                                />
                            </a>
                        ))}
                    </div>

                    <div className="text-center space-y-1">
                        <p className="font-medium">© Snaply 2025. Все права защищены.</p>
                        <p className="font-medium">
                            Применяются{" "}
                            <a
                                href="https://github.com/vovan-ivanoff/dead10cc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:text-purple-700"
                            >
                                рекомендательные технологии
                            </a>
                        </p>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;  