'use client'
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submitButton";
import { useActionState, useEffect } from "react";
import { signup } from "@/app/features/auth/actions";
import { toast } from "sonner";

export default function SignupPage() {
    const initialState = {
        success: false,
        message: "",
    };
    const [state, formAction] = useActionState(signup, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Cadastro realizado com sucesso!");
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white p-8 rounded shadow-md max-w-xl w-full dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
                <form action={formAction} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <Input id="email" type="email" name="email" placeholder="Digite seu email" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
                        <Input id="password" name="password" type="password" placeholder="Digite sua senha" required />
                    </div>
                    <SubmitButton text="Cadastrar" />
                </form>
            </div>
        </div>
    );
}

