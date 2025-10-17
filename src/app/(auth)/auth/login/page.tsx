'use client'
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { login } from "@/app/features/auth/actions";
import { toast } from "sonner";
import { SubmitButton } from "@/components/shared/submitButton";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function LoginPage() {
    const initialState = {
        success: false,
        message: "",
    };
    const [state, formAction] = useActionState(login, initialState);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Login realizado com sucesso!");
        } else if (state.message) {
            toast.error(state.message);
        }
    }
        , [state]);

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
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                                {showPassword ? "Ocultar senha" : "Mostrar senha"}
                            </span>
                        </Button>
                    </div>
                </div>
                <SubmitButton text="Entrar" />
            </form>
            <div className="mt-4 text-center text-sm">
                Não tem uma conta?{" "}
                <Link href="/auth/cadastro" className="underline">
                    Cadastre-se
                </Link>
            </div>
        </>
    );
}