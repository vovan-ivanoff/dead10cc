import { 
    ArrowLeftIcon,
    CopyIcon,
    Heart,
    MessageCircleIcon,
    RotateCwIcon,
  } from "lucide-react";
  import { useState } from "react";
  import Image from "next/image";
  
  import { Button } from "../ui/AdminButton";
  import { Card, CardContent } from "../ui/Card";
  import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs";

export default function ProductPage({ product }: { product: Product }) {
    const [liked, setLiked] = useState(false);

    return (
        <main className="container mx-auto mt-2 mb-6">
            <div className="mb-6 flex items-center">
                <Button variant="ghost" className="mr-4 p-0">
                    <ArrowLeftIcon className="h-[30px] w-[34px] text-gray-500" />
                </Button>
                <span className="text-xs font-medium text-gray-500 mt-1">
                    Шаблон путь к товару
                </span>

                <div className="ml-auto">
                    <div className="flex items-center justify-center">
                        <div className="flex gap-2">
                            <Heart
                                onClick={() => setLiked(!liked)}
                                className={`cursor-pointer transition-all w-6 h-6 ${liked
                                    ? "text-purple-500 fill-current"
                                    : "text-gray-500 fill-none hover:text-purple-500"
                                    }`}
                            />
                            <MessageCircleIcon className="cursor-pointer transition-all w-6 h-6 text-gray-500 fill-none hover:text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-4">
                    <div className="relative h-[524px] rounded-[15px] overflow-hidden">
                        <Image
                            src="/assets/icons/rect-52.svg"
                            alt="background"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-2 px-2 py-1 w-fit bg-white rounded-xl shadow-sm">
                            <Image
                                src="/assets/icons/filter-search.svg"
                                alt="filter"
                                width={15}
                                height={15}
                                className="object-contain"
                            />
                            <h3 className="text-sm font-medium text-gray-800 mt-1">Похожие</h3>
                        </div>
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <div className="h-[81px] w-[63px] rounded-[5px] bg-[#d9d9d9]"></div>
                        <div className="h-[81px] w-[63px] rounded-[5px] bg-[#d9d9d9]"></div>
                    </div>
                </div>

                <div className="col-span-4">
                    <div className="flex h-[22px] w-[89px] rounded-[8px] bg-[#f1f1f1] px-0 py-0">
                        <span className="flex w-full items-center justify-center text-[13px] font-medium mt-1">
                            Продавец
                        </span>
                    </div>

                    <h1 className="mt-2 whitespace-pre-line text-xl font-bold">Название товара</h1>

                    <div className="mt-1 flex items-center">
                        <Image
                            src="/assets/icons/star-2.svg"
                            alt="Star"
                            width={15}
                            height={15}
                            className="mr-1"
                        />
                        <span className="mt-1.5 mr-6 text-md font-medium">
                            5.0
                        </span>
                        <span className="mt-1.5 text-md font-medium">
                            10 оценок
                            <span className="ml-1 text-[#605f5f]">&gt;</span>
                        </span>
                    </div>

                    <div className="flex mt-2 text-md">
                        <h3 className="font-bold">Цвет:</h3>
                        <h3 className="ml-1 font-medium">черный</h3>
                    </div>

                    <div className="mt-4 text-sm font-medium text-[#605f5f]">
                        Таблица размеров &gt;
                    </div>

                    <div className="mt-3 flex space-x-3">
                        <Button
                            key="10"
                            variant="outline"
                            className="h-9 w-[55px] rounded-[10px] border-[1.7px] hover:border-gray-500 border-[#d9d9d9] p-0"
                        >
                            <span className="mt-1 text-md font-medium">50-52</span>
                        </Button>
                    </div>

                    <div className="mt-6">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-xs">
                            <div className="font-medium text-gray-500">Артикул</div>
                            <div className="flex items-center font-medium">
                                1337133752
                                <CopyIcon className="ml-2 h-[15px] w-[15px]" />
                            </div>

                            <div className="font-medium text-gray-500">Состав</div>
                            <div className="font-medium">состав</div>

                            <div className="font-medium text-gray-500">Пол</div>
                            <div className="font-medium">гендер</div>

                            <div className="font-medium text-gray-500">Размер на модели</div>
                            <div className="font-medium">размер</div>

                            <div className="font-medium text-gray-500">Рост модели</div>
                            <div className="font-medium">Рост</div>
                        </div>
                    </div>

                    <Button
                        variant="default"
                        className="mt-4 h-[25px] w-[225px] rounded-[9px] bg-gray-50 hover:bg-gray-100 px-3 py-1"
                    >
                        <span className="mt-1 text-sm font-medium">
                            Характеристики и описание
                            <span className="ml-1 text-[#6b6b6b]">&gt;</span>
                        </span>
                    </Button>

                    <div className="mt-4 flex items-center">
                        <RotateCwIcon className="mr-2 h-5 w-5" />
                        <span className="mt-1 text-sm font-medium">14 дней на возврат</span>
                    </div>

                    <div className="mt-2 flex items-center">
                        <Image
                            src="/assets/icons/coathanger.svg"
                            alt="Coat hanger"
                            width={20}
                            height={20}
                            className="mr-2"
                        />
                        <span className="mt-1 text-sm font-medium">Есть примерка</span>
                    </div>
                </div>

                <div className="col-span-4">
                    <Card className="rounded-[20px] bg-white">
                        <CardContent className="p-8">
                            <div className="flex">
                                <div className="mb-1 text-3xl font-bold text-purple-600">
                                    1000 ₽
                                </div>
                                <div className="ml-4 flex items-center">
                                    <span className="text-md font-medium">
                                        1200 ₽
                                    </span>
                                    <span className="ml-4 text-md font-medium text-[#908f8f] line-through">
                                        1500 ₽
                                    </span>
                                </div>
                            </div>

                            <div className="mt-2 text-sm font-medium text-purple-600">
                                с WB Кошельком
                            </div>

                            <div className="mt-4 text-[12px] font-medium text-[#656565]">
                                Осталось 52 шт.
                            </div>

                            <button className="mt-2 w-full h-11 p-2 bg-[#A232E8] hover:bg-[#AF4DFD] text-white text-lg rounded-2xl transition-all duration-300 ease-in-out">
                                <h3 className="mt-0.5">Добавить в корзину</h3>
                            </button>

                            <button className="mt-3 w-full h-11 p-2 bg-[#E7C9F9] hover:bg-[#e5bdfd] text-[#A232E8] text-lg rounded-2xl transition-all duration-300 ease-in-out">
                                <h3 className="mt-0.5">Купить сейчас</h3>
                            </button>

                            <div className="mt-4 flex items-center">
                                <Image
                                    src="/assets/icons/Package.svg"
                                    alt="Package"
                                    width={20}
                                    height={20}
                                    className="mr-2"
                                />
                                <span className="text-[13px] font-medium mt-1">
                                    Завтра, <span className="text-gray-500">склад WB</span>
                                </span>
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <Image
                                        src="/assets/icons/Basket.svg"
                                        alt="Basket"
                                        width={20}
                                        height={20}
                                        className="mr-2"
                                    />
                                    <span className="text-[13px] font-medium mt-1 mr-2">Продавец</span>
                                    <Image
                                        src="/assets/icons/star-2.svg"
                                        alt="Star"
                                        width={15}
                                        height={15}
                                        className="mr-1"
                                    />
                                    <span className="mt-1.5 mr-6 text-md font-medium">
                                        5.0
                                    </span>
                                </div>

                                <div className="mt-3 flex items-center">
                                    <div className="flex gap-2">
                                        <Image
                                            src="/assets/icons/dolki.svg"
                                            alt="avatar"
                                            width={27}
                                            height={27}
                                            className="object-contain"
                                        />
                                        <h3 className="font-medium mt-1.5">Частями</h3>
                                        <Image
                                            src="/assets/icons/control.svg"
                                            alt="control"
                                            width={20}
                                            height={20}
                                            className="object-contain mt-0.5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="reviews" className="mt-6">
                        <TabsList className="bg-transparent p-0 gap-4">
                            <TabsTrigger
                                value="reviews"
                                className="text-base text-[#989898] font-bold data-[state=active]:text-black data-[state=active]:font-bold"
                            >
                                Оценки
                            </TabsTrigger>
                            <TabsTrigger
                                value="questions"
                                className="text-base text-[#989898] font-bold data-[state=active]:text-black data-[state=active]:font-bold"
                            >
                                Вопросы
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                </div>
            </div>
        </main>
    )
}