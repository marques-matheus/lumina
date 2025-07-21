import Link from "next/link";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Obrigado por se registrar',
    description: 'Página de agradecimento após o registro',
};

export default function ThankYouPage() {
    return (
        <div className="flex flex-col lg:flex-row bg-white dark:bg-zinc-900 w-auto">

            <div className="flex items-center justify-center py-12 px-4 sm:px-6  w-auto">
                <div className="mx-auto grid w-[300px] lg:w-[450px] ">
                    <div className="grid gap-2 text-center">
                        <svg
                            className="mx-auto mb-4 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
                            <path
                                d="M7 13l3 3 7-7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                        <h1 className="text-3xl font-bold">Obrigado por se registrar!</h1>
                        <p className="text-balance text-muted-foreground">
                            Um e-mail de confirmação foi enviado para o endereço informado.
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <p className="text-center text-muted-foreground">
                            Por favor, verifique sua caixa de entrada e siga as instruções para ativar sua conta.
                        </p>
                        <p className="text-sm text-center text-muted-foreground">
                            Caso não encontre o e-mail, verifique também sua caixa de spam.
                        </p>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Já confirmou seu e-mail?{" "}
                        <Link href="/auth/login" className="underline">
                            Faça login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}