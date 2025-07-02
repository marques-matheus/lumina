'use client'
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { updateProfile } from "@/app/features/auth/actions";
import { toast } from "sonner";
import { SessionUser } from "@/types";

export default function ProfileForm({ user }: { user: SessionUser }) {
    const initialState = {
        success: false,
        message: "",
    };
    const [state, formAction] = useActionState(updateProfile, initialState);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Cadastro finalizado com sucesso!");
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (

        <Card className="w-full  p-6 bg-white dark:bg-zinc-800">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Completar Cadastro</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="hidden" name="id" value={user.id} />
                        <div>
                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Empresa</Label>
                                        <Input id="company_name" name="company_name" type="text" defaultValue={user.company_name} placeholder="Digite o nome da empresa" required className="w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <Label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Nome da Empresa
                                        </Label>
                                        <p className="text-gray-500 dark:text-gray-400">{user.company_name}</p>
                                    </>
                                )
                            }
                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNPJ</Label>
                                        <Input id="cnpj" name="cnpj" type="text" defaultValue={user.cnpj} placeholder="Digite o CNPJ da empresa" required className="w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <Label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            CNPJ
                                        </Label>
                                        <p className="text-gray-500 dark:text-gray-400">{user.cnpj}</p>
                                    </>
                                )
                            }
                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="services" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serviços Oferecidos</Label>
                                        <Textarea id="services" name="services" defaultValue={user.service_types?.join(', ')} placeholder="Descreva os serviços oferecidos pela empresa, separando por vírgulas" required className="w-full h-32" />
                                    </div>
                                ) : (
                                    <>
                                        <Label htmlFor="services" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Serviços Oferecidos
                                        </Label>
                                        <p className="text-gray-500 dark:text-gray-400">{user.service_types?.join(', ')}</p>
                                    </>
                                )
                            }
                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="does_provide_services" className="flex items-center space-x-2">
                                            <Checkbox id="does_provide_services" name="does_provide_services" defaultChecked={user.does_provide_services} />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sou prestador de serviços</span>
                                        </Label>
                                    </div>
                                ) : (
                                    <Label htmlFor="does_provide_services" className="flex items-center space-x-2">
                                        <Checkbox id="does_provide_services" name="does_provide_services" checked={user.does_provide_services} disabled />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sou prestador de serviços</span>
                                    </Label>
                                )
                            }
                        </div>
                        <div>
                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço</Label>
                                        <Input id="street" name="street" type="text" placeholder="Digite o endereço da empresa" defaultValue={user.street} required className="w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <Label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Endereço
                                        </Label>
                                        <p className="text-gray-500 dark:text-gray-400">{user.street}</p>
                                    </>
                                )
                            }

                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</Label>
                                        <Input id="city" name="city" type="text" placeholder="Digite a cidade da empresa" defaultValue={user.city} required className="w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <Label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Cidade
                                        </Label>
                                        <p className="text-gray-500 dark:text-gray-400">{user.city}</p>
                                    </>
                                )
                            }
                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</Label>
                                        <Input id="state" name="state" type="text" placeholder="Digite o estado da empresa" defaultValue={user.state} required className="w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <Label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Estado
                                        </Label>
                                        <p className="text-gray-500 dark:text-gray-400">{user.state}</p>
                                    </>
                                )
                            }
                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</Label>
                                        <Input id="zip_code" name="zip_code" type="text" placeholder="Digite o CEP da empresa" defaultValue={user.zip_code} required className="w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <Label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            CEP
                                        </Label>
                                        <p className="text-gray-500 dark:text-gray-400">{user.zip_code}</p>
                                    </>
                                )
                            }
                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="complement" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Complemento</Label>
                                        <Input id="complement" name="complement" type="text" defaultValue={user.complement} placeholder="Digite o complemento do endereço (opcional)" className="w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <Label htmlFor="complement" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Complemento
                                        </Label>
                                        <p className="text-gray-500 dark:text-gray-400">{user.complement || 'Nenhum complemento informado'}</p>
                                    </>
                                )
                            }
                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bairro</Label>
                                        <Input id="neighborhood" name="neighborhood" type="text" placeholder="Digite o bairro da empresa" defaultValue={user.neighborhood} required className="w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <Label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Bairro
                                        </Label>
                                        <p className="text-gray-500 dark:text-gray-400">{user.neighborhood}</p>
                                    </>
                                )
                            }
                            {
                                isEditing ? (
                                    <div>
                                        <Label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número</Label>
                                        <Input id="number" name="number" type="text" placeholder="Digite o número do endereço" defaultValue={user.number} required className="w-full" />
                                    </div>
                                ) : (
                                    <>
                                        <Label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Número
                                        </Label>
                                        <p className="text-gray-500 dark:text-gray-400">{user.number}</p>
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        {isEditing ? (
                            <>
                                <Button type="submit" className="w-full md:w-auto">Salvar</Button>
                                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
                            </>
                        ) : (
                            <Button type="button" onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>

    );
}
