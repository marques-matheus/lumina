'use client'

import { Input } from "@/components/ui/input";
import { useActionState, useEffect } from "react";
import { requestPasswordReset } from "@/app/features/auth/actions";
import { toast } from "sonner";
import { SubmitButton } from "@/components/shared/submitButton";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
    const initialState = {
        success: false,
        message: "",
    };
    const [state, formAction] = useActionState(requestPasswordReset, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Email de recuperação enviado!");
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/auth/login">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <CardTitle className="text-2xl">Esqueci a senha</CardTitle>
                    </div>
                    <CardDescription>
                        Digite seu email e enviaremos instruções para redefinir sua senha
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="nome@exemplo.com"
                                    required
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <SubmitButton text="Enviar link de recuperação" />
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Lembrou a senha?{" "}
                        <Link href="/auth/login" className="underline">
                            Voltar ao login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
