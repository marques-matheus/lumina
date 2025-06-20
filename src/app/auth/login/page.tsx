'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Metadata, ResolvingMetadata } from "next";
import { useActionState, useEffect } from "react";
import { login } from "@/app/features/auth/actions";
import { toast } from "sonner";
import { SubmitButton } from "@/components/shared/submitButton";

// export const metadata: Metadata = {
//     title: "Login",
//     description: "Faça login para acessar sua conta",
// };
// export async function generateMetadata(
//     _props: {},
//     _parent: ResolvingMetadata
// ): Promise<Metadata> {
//     return {
//         title: "Lúmina - Login",
//         description: "Faça login para acessar sua conta",
//     };
// }

export default function LoginPage() {
    const initialState = {
        success: false,
        message: "",
    };
    const [state, formAction] = useActionState(login, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Login realizado com sucesso!");
        } else if (state.message) {
            toast.error(state.message);
        }
    }
        , [state]);


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form action={formAction} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input id="email" type="email" name="email" placeholder="Digite seu email" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                        <Input id="password" name="password" type="password" placeholder="Digite sua senha" required />
                    </div>
                    <SubmitButton text="Entrar" />
                </form>
            </div>
        </div>
    );
}