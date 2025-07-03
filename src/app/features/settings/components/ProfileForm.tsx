'use client'

import { useActionState, useEffect, useState } from "react";
import { updateProfile } from "@/app/features/auth/actions";
import { toast } from "sonner";
import { type SessionUser } from "@/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


const ProfileView = ({ user, onEditClick }: { user: SessionUser, onEditClick: () => void }) => (
    <>
        <div className="space-y-6 text-sm">
            {/* Seção de Dados da Empresa */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b pb-2">Dados da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                    <div>
                        <p className="font-medium text-muted-foreground">Nome da Empresa</p>
                        <p>{user.company_name || 'Não informado'}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">CNPJ</p>
                        <p>{user.cnpj || 'Não informado'}</p>
                    </div>
                </div>
            </div>

            {/* Seção de Endereço */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b pb-2">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                    <div>
                        <p className="font-medium text-muted-foreground">Rua</p>
                        <p>{`${user.street || ''}, ${user.number || ''}`}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">Bairro</p>
                        <p>{user.neighborhood || 'Não informado'}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">Cidade / Estado</p>
                        <p>{`${user.city || ''} - ${user.state || ''}`}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">CEP</p>
                        <p>{user.zip_code || 'Não informado'}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">Complemento</p>
                        <p>{user.complement || 'Nenhum'}</p>
                    </div>
                </div>
            </div>

            {/* Seção de Serviços */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b pb-2">Serviços</h3>
                <div className="pt-2">
                    <p className="font-medium text-muted-foreground">Oferece Serviços?</p>
                    <p>{user.does_provide_service ? 'Sim' : 'Não'}</p>
                </div>
                { user.does_provide_service && (
                    <div className="pt-2">
                    <p className="font-medium text-muted-foreground">Tipos de Serviço</p>
                    <p>{user.service_types?.join(', ') || 'Nenhum'}</p>
                </div>
                ) }
            </div>
        </div>
        <div className="flex justify-end mt-8">
            <Button type="button" onClick={onEditClick}>Editar Perfil</Button>
        </div>
    </>
);


const ProfileEdit = ({ user, formAction, onCancelClick }: { user: SessionUser, formAction: any, onCancelClick: () => void }) => (
    <>
        <form id="profile-form" action={formAction} className="space-y-6">
            <Input type="hidden" name="id" value={user.id} />

            {/* Seção de Dados da Empresa */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Dados da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="company_name">Nome da Empresa</Label><Input id="company_name" name="company_name" defaultValue={user.company_name || ''} required /></div>
                    <div><Label htmlFor="cnpj">CNPJ</Label><Input id="cnpj" name="cnpj" defaultValue={user.cnpj || ''} /></div>
                </div>
            </div>

            {/* Seção de Endereço */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><Label htmlFor="street">Rua</Label><Input id="street" name="street" defaultValue={user.street || ''} required /></div>
                    <div><Label htmlFor="number">Número</Label><Input id="number" name="number" defaultValue={user.number || ''} /></div>
                    <div><Label htmlFor="complement">Complemento</Label><Input id="complement" name="complement" defaultValue={user.complement || ''} /></div>
                    <div><Label htmlFor="neighborhood">Bairro</Label><Input id="neighborhood" name="neighborhood" defaultValue={user.neighborhood || ''} required /></div>
                    <div><Label htmlFor="city">Cidade</Label><Input id="city" name="city" defaultValue={user.city || ''} required /></div>
                    <div><Label htmlFor="state">Estado (UF)</Label><Input id="state" name="state" defaultValue={user.state || ''} maxLength={2} required /></div>
                    <div><Label htmlFor="zip_code">CEP</Label><Input id="zip_code" name="zip_code" defaultValue={user.zip_code || ''} required /></div>
                </div>
            </div>

            {/* Seção de Serviços */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Serviços</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox id="does_provide_service" name="does_provide_service" defaultChecked={user.does_provide_service} />
                    <Label htmlFor="does_provide_service">Eu ofereço serviços (ex: consertos, manutenções)</Label>
                </div>
                <div>
                    <Label htmlFor="services">Tipos de Serviço (separados por vírgula)</Label>
                    <Textarea id="services" name="services" placeholder="Ex: Conserto de Celular, Manutenção de Notebook..." defaultValue={user.service_types?.join(', ')} />
                </div>
            </div>
        </form>
        <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={onCancelClick}>Cancelar</Button>
            <Button form="profile-form" > {user.has_completed_onboarding ? "Salvar Alterações" : "Finalizar Cadastro"}</Button>
        </div>
    </>
);


export default function ProfileForm({ user, startInEditMode = false }: { user: SessionUser, startInEditMode?: boolean }) {
    const initialState = { success: false, message: "" };
    const [state, formAction] = useActionState(updateProfile, initialState);
    const [isEditing, setIsEditing] = useState(startInEditMode);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            setIsEditing(false);
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <Card className="w-full p-6 bg-white dark:bg-zinc-800">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    {user.has_completed_onboarding ? "Meu Perfil" : "Complete seu Cadastro"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <ProfileEdit
                        user={user}
                        formAction={formAction}
                        onCancelClick={() => setIsEditing(false)}
                    />
                ) : (
                    <ProfileView
                        user={user}
                        onEditClick={() => setIsEditing(true)}
                    />
                )}
            </CardContent>
        </Card>
    );
}