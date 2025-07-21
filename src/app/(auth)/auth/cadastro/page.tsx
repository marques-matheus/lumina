'use client'
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submitButton";
import { useActionState, useEffect } from "react";
import { signup } from "@/app/features/auth/actions";
import { toast } from "sonner";
import Banner, { MobileBanner } from "@/app/features/auth/components/banner";
import { Label } from "@/components/ui/label";
import Link from "next/link";


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
        <>

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
                <SubmitButton text="Cadastrar" />
            </form>
            <div className="mt-1  text-center text-sm">
                Já tem uma conta?
                <Link href="/auth/login" className="underline mx-2">
                    Entre
                </Link>
            </div>
        </>
    );
}

