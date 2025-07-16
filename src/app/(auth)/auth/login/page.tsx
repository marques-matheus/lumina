'use client'
import { Input } from "@/components/ui/input";
import { useActionState, useEffect } from "react";
import { login } from "@/app/features/auth/actions";
import { toast } from "sonner";
import { SubmitButton } from "@/components/shared/submitButton";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import Banner from "@/app/features/auth/components/banner";

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
        <div className="flex min-h-screen  bg-white dark:bg-zinc-900">
            <Banner />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full lg:w-7/12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        
                    </div>
                    <form action={formAction} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nome@exemplo.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Senha</Label>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <SubmitButton text="Entrar" />
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Não tem uma conta?{" "}
                        <Link href="/auth/cadastro" className="underline">
                            Cadastre-se
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}