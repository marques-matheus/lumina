'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, type ProfileFormData } from '@/lib/schemas';


import { updateProfile } from '@/app/features/auth/actions';

import { type SessionUser } from '@/types';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const ProfileView = ({ user, onEditClick }: { user: SessionUser, onEditClick: () => void }) => (
    <>
        <div className="space-y-6 text-sm">
            {/* Seção de Dados da Empresa */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b pb-2">Dados da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                    <div><p className="font-medium text-muted-foreground">Nome da Empresa</p><p>{user.company_name || 'Não informado'}</p></div>
                    <div><p className="font-medium text-muted-foreground">CNPJ</p><p>{user.cnpj || 'Não informado'}</p></div>
                </div>
            </div>
            {/* Seção de Endereço */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b pb-2">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                    <div><p className="font-medium text-muted-foreground">Rua</p><p>{`${user.street || ''}, ${user.number || ''}`}</p></div>
                    <div><p className="font-medium text-muted-foreground">Bairro</p><p>{user.neighborhood || 'Não informado'}</p></div>
                    <div><p className="font-medium text-muted-foreground">Cidade / Estado</p><p>{`${user.city || ''} - ${user.state || ''}`}</p></div>
                    <div><p className="font-medium text-muted-foreground">CEP</p><p>{user.zip_code || 'Não informado'}</p></div>
                </div>
            </div>
            {/* Seção de Serviços */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg border-b pb-2">Serviços</h3>
                <div className="pt-2"><p className="font-medium text-muted-foreground">Oferece Serviços?</p><p>{user.does_provide_service ? 'Sim' : 'Não'}</p></div>
                {user.does_provide_service && (<div className="pt-2"><p className="font-medium text-muted-foreground">Tipos de Serviço</p><p>{user.service_types?.join(', ') || 'Nenhum'}</p></div>)}
            </div>
        </div>
        <div className="flex justify-end mt-8">
            <Button type="button" onClick={onEditClick}>Editar Perfil</Button>
        </div>
    </>
);

const ProfileEditForm = ({ user, onCancelClick }: { user: SessionUser, onCancelClick: () => void }) => {
    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            company_name: user.company_name || '',
            cnpj: user.cnpj || '',
            zip_code: user.zip_code || '',
            street: user.street || '',
            number: user.number || '',
            neighborhood: user.neighborhood || '',
            city: user.city || '',
            state: user.state || '',
            complement: user.complement || '',
            does_provide_service: user.does_provide_service ?? false,
            service_types: user.service_types?.join(', ') || '',
        },
    });

    const router = useRouter();

    const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const cep = event.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                form.setValue('street', data.logradouro);
                form.setValue('neighborhood', data.bairro);
                form.setValue('city', data.localidade);
                form.setValue('state', data.uf);
                toast.success("Endereço preenchido automaticamente!");
            } else {
                toast.error("CEP não encontrado.");
            }
        } catch (error) {
            toast.error("Erro ao buscar CEP.");
        }
    };

    async function onSubmit(data: ProfileFormData) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        const result = await updateProfile({ success: false, message: '' }, formData);

        if (result.success) {
            toast.success(result.message);
            onCancelClick();
            router.refresh();
        } else {
            toast.error(result.message);
        }
    }

    const doesProvideServices = form.watch('does_provide_service');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Dados da Empresa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="company_name" render={({ field }) => (
                            <FormItem><FormLabel>Nome da Empresa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="cnpj" render={({ field }) => (
                            <FormItem><FormLabel>CNPJ (apenas números)</FormLabel><FormControl><Input {...field}  maxLength={14} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField control={form.control} name="zip_code" render={({ field }) => (
                            <FormItem><FormLabel>CEP</FormLabel><FormControl><Input {...field} onBlur={handleCepBlur} maxLength={8} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="street" render={({ field }) => (
                            <FormItem className="md:col-span-2"><FormLabel>Rua</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="number" render={({ field }) => (
                            <FormItem><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="neighborhood" render={({ field }) => (
                            <FormItem className="md:col-span-2"><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="state" render={({ field }) => (
                            <FormItem><FormLabel>Estado (UF)</FormLabel><FormControl><Input {...field} maxLength={2} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="complement" render={({ field }) => (
                            <FormItem><FormLabel>Complemento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Serviços</h3>
                    <FormField control={form.control} name="does_provide_service" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Eu ofereço serviços (ex: consertos, manutenções)</FormLabel></div></FormItem>
                    )} />
                    {doesProvideServices && (
                        <FormField control={form.control} name="service_types" render={({ field }) => (
                            <FormItem><FormLabel>Tipos de Serviço (separados por vírgula)</FormLabel><FormControl><Textarea {...field} placeholder="Ex: Conserto de Celular..." /></FormControl><FormMessage /></FormItem>
                        )} />
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="secondary" onClick={onCancelClick}>Cancelar</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Salvando..." : (user.has_completed_onboarding ? "Salvar Alterações" : "Finalizar Cadastro")}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default function ProfileForm({ user, startInEditMode = false }: { user: SessionUser, startInEditMode?: boolean }) {
    const [isEditing, setIsEditing] = useState(startInEditMode);

    return (
        <Card className="w-full p-6 bg-white dark:bg-zinc-800">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    {user.has_completed_onboarding ? "Meu Perfil" : "Complete seu Cadastro"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <ProfileEditForm
                        user={user}
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