'use client'
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { completeOnboarding } from "@/app/features/auth/actions";
import { toast } from "sonner";

export default function FinishSignup() {
    const initialState = {
        success: false,
        message: "",
    };
    const [state, formAction] = useActionState(completeOnboarding, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Cadastro finalizado com sucesso!");
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-5xl p-6 bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Completar Cadastro</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div>
                                    <Label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Empresa</Label>
                                    <Input id="company_name" name="company_name" type="text" placeholder="Digite o nome da empresa" required className="w-full" />
                                </div>
                                <div>
                                    <Label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNPJ</Label>
                                    <Input id="cnpj" name="cnpj" type="text" placeholder="Digite o CNPJ da empresa" required className="w-full" />
                                </div>
                                <div>
                                    <Label htmlFor="services" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serviços Oferecidos</Label>
                                    <Textarea id="services" name="services" placeholder="Descreva os serviços oferecidos pela empresa, separando por vírgulas" required className="w-full h-32" />
                                </div>
                                <div>
                                    <Label htmlFor="does_provide_services" className="flex items-center space-x-2">
                                        <Checkbox id="does_provide_services" name="does_provide_services" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sou prestador de serviços</span>
                                    </Label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <Label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rua</Label>
                                    <Input id="street" name="street" type="text" placeholder="Rua" required className="w-full" />
                                </div>
                                <div>
                                    <Label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número</Label>
                                    <Input id="number" name="number" type="number" placeholder="Número" required className="w-full" />
                                </div>
                                <div>
                                    <Label htmlFor="complement" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Complemento</Label>
                                    <Input id="complement" name="complement" type="text" placeholder="Complemento" className="w-full" />
                                </div>
                                <div>
                                    <Label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</Label>
                                    <Input id="city" name="city" type="text" placeholder="Cidade" required className="w-full" />
                                </div>
                                <div>
                                    <Label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bairro</Label>
                                    <Input id="neighborhood" name="neighborhood" type="text" placeholder="Bairro" required className="w-full" />
                                </div>
                                <div>
                                    <Label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</Label>
                                    <Input id="state" name="state" type="text" placeholder="Estado" required className="w-full" />
                                </div>
                                <div>
                                    <Label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</Label>
                                    <Input id="zip_code" name="zip_code" type="text" placeholder="CEP" required className="w-full" />
                                </div>                            </div>
                        </div>
                        <Button type="submit" className="w-full mt-4">Finalizar Cadastro</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
