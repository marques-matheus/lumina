// Defina o 'type ServiceOrder' aqui, importando de '@/types'
import { type ServiceOrder } from '@/types';

export default function PrintableOrder({ order }: { order: ServiceOrder | null }) {
    if (!order) return null;

    return (
        
        <div className="printable-area p-2 ">
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold">COMPROVANTE DE ORDEM DE SERVIÇO</h1>
                <p className="text-sm">O.S. Número: {order.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div>
                    <h2 className="font-bold border-b mb-2">DADOS DO CLIENTE</h2>
                    <p><strong>Nome:</strong> {order.clients?.name}</p>
                    <p><strong>Telefone:</strong> {order.clients?.phone}</p>
                </div>
                <div>
                    <h2 className="font-bold border-b mb-2">DATAS</h2>
                    <p><strong>Entrada:</strong> {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                </div>

                <div className="col-span-2 grid">
                    <h2 className="font-bold border-b mb-2">DETALHES DO EQUIPAMENTO</h2>
                    <p><strong>Tipo:</strong> {order.type}</p>
                    <p><strong>Marca/Modelo:</strong> {order.equip_brand} {order.equip_model}</p>
                    <p><strong>Nº de Série:</strong> {order.serial_number}</p>
                    <p><strong>Itens Acompanhantes:</strong> {order.items || 'Nenhum'}</p>
                </div>

                <div className="col-span-2">
                    <h2 className="font-bold border-b mb-2">PROBLEMA RELATADO</h2>
                    <p>{order.problem_description}</p>
                </div>

            </div>

            <div className="mt-8 flex justify-between items-baseline text-sm">
                <div>
                    <p className="mb-2">_______________________________________________________________________________</p>
                    <p>Assinatura do Cliente</p>

                </div>
                <div className="col-span-2">
                    <h2 className="font-bold border-b mb-2">VALOR TOTAL</h2>
                    <p>R$ {order.total.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}