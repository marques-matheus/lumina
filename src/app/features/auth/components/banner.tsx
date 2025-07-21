import Image from "next/image";
// import { useState, useEffect } from "react";

// const images = [
//     "/image1.webp",
//     "/image2.webp",
//     "/image3.webp",
// ];

export default function Banner() {
    // const [randomImage, setRandomImage] = useState<string | null>(null);

    // useEffect(() => {
    //     const selectedImage = images[Math.floor(Math.random() * images.length)];
    //     setRandomImage(selectedImage);
    // }, []);
    return (
        <div
            className="hidden lg:flex lg:flex-col items-center justify-center w-5/12 space-y-2.5 p-8 text-center bg-white dark:bg-zinc-900 transition-all duration-500"
            style={{

                // backgroundImage: randomImage ? `url('${randomImage}')` : 'none',
                backgroundImage: `url('/image1.webp')`,
                backgroundColor: "rgb(88, 108, 145)",
                backgroundRepeat: "no-repeat",
                backgroundBlendMode: "multiply",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Image src="/logo.png" alt="Logo" width={160} height={160} />
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Lúmina</h1>
            <p className="mt-4 text-muted-foreground">
                A gestão do seu negócio, iluminada.
            </p>
        </div>
    )
}

export function MobileBanner() {
    return (
        <div className="flex flex-col lg:hidden items-center justify-center w-full space-y-2.5 p-8 text-center bg-white dark:bg-zinc-900">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Lúmina</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                A gestão do seu negócio, iluminada.
            </p>
        </div>
    )

}