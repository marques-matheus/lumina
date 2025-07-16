import Image from "next/image";

export default function Banner() {
    return (
        <div className="hidden lg:flex lg:flex-col items-center justify-center w-5/12 space-y-2.5 p-8 text-center bg-white dark:bg-zinc-900"
            style={{
                backgroundImage: "url('/image1.webp')",
                backgroundColor: "rgb(65, 65, 65)",
                backgroundRepeat: "no-repeat",
                backgroundBlendMode: "multiply",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Image src="/logo.png" alt="Logo" width={200} height={200} />
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">Lúmina</h1>
            <p className="mt-4 text-muted-foreground">
                A gestão do seu negócio, iluminada.
            </p>
        </div>
    )
}