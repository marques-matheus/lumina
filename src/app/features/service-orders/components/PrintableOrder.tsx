'use client'
import { type ServiceOrder } from '@/types';
import { useSession } from '@/providers/SessionProvider';

export default function PrintableOrder({ order }: { order: ServiceOrder | null }) {
    if (!order) return null;
    const user = useSession();

    return (
        <div className="printable-area bg-white text-gray-800 font-sans text-sm">
            <div className="p-8">
                <header className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <img src="/logo.png" alt="Company Logo" className="h-12 mr-4" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user?.company_name || 'Nome da Empresa'}</h1>
                            <p className="text-xs text-gray-500">Ordem de Serviço</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">O.S. #{order.id}</p>
                        <p className="text-xs text-gray-500">Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                </header>

                <main className="mt-8 grid grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-2 mb-2">Dados do Cliente</h2>
                        <p><strong>Nome:</strong> {order.clients?.name}</p>
                        <p><strong>Telefone:</strong> {order.clients?.phone}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-2 mb-2">Status do Serviço</h2>
                        <p><strong>Status:</strong> <span className="font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">{order.status}</span></p>
                        <p className="mt-2"><strong>Valor Total:</strong> <span className="font-bold text-lg text-gray-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</span></p>
                    </div>

                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-2 mb-2">Detalhes do Equipamento</h2>
                        <div className="grid grid-cols-2 gap-x-4">
                            <p><strong>Tipo:</strong> {order.type}</p>
                            <p><strong>Marca/Modelo:</strong> {`${order.equip_brand} ${order.equip_model}`}</p>
                            <p><strong>Nº de Série:</strong> {order.serial_number || 'N/A'}</p>
                            <p><strong>Itens Acompanhantes:</strong> {order.items || 'Nenhum'}</p>
                        </div>
                    </div>

                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-2 mb-2">Problema Relatado</h2>
                        <p className="whitespace-pre-wrap">{order.problem_description}</p>
                    </div>
                </main>

                <footer className="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500">
                    <div className="flex justify-between">
                        <div className="w-1/2 pt-12">
                            <div className="border-t border-gray-400 w-full"></div>
                            <p className="text-center mt-2">Assinatura do Cliente</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-800">{user?.company_name}</p>
                            <p>{user?.street}, {user?.number}</p>
                            <p>{user?.city} - {user?.state}, {user?.zip_code}</p>
                            <p>Email: {user?.email}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}