'use client';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Input } from './ui/input';

type ServiceOrder = {
    id: number;
    created_at: string;
    clients: {
        name: string;
    } | null;
    equip_brand: string;
    equip_model: string;
    serial_number: string;
    type: string;
    items?: string;
    status: string;
    problem_description: string;
    total: number;
    delivered_at: string | null;
};
const ServiceOrdersTable = ({ serviceOrders }: { serviceOrders: ServiceOrder[] }) => {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);

    const handleEditClick = (serviceOrder: ServiceOrder) => {
        setSelectedServiceOrder(serviceOrder);
        setIsDialogOpen(true);
    };


    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Ordens de serviço</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>

                                <TableHead className="w-[100px]">Data de Entrada</TableHead>
                                <TableHead className="w-[100px]">Cliente</TableHead>
                                <TableHead className="w-[100px]">Marca</TableHead>
                                <TableHead className="w-[100px]">Modelo</TableHead>
                                <TableHead className="w-[100px]">Serial</TableHead>
                                <TableHead className="w-[100px]">Tipo</TableHead>
                                <TableHead className="w-[100px]">Total</TableHead>

                                <TableHead className="w-[100px]">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serviceOrders.map((serviceOrder) => (
                                <TableRow key={serviceOrder.id} className={`${serviceOrder.id % 2 === 0 ? 'bg-gray-100' : ''}`} onClick={() => handleEditClick(serviceOrder)}>

                                    <TableCell>
                                        {new Date(serviceOrder.created_at).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell>{serviceOrder.clients?.name}</TableCell>
                                    <TableCell>{serviceOrder.equip_brand}</TableCell>
                                    <TableCell>{serviceOrder.equip_model}</TableCell>
                                    <TableCell>{serviceOrder.serial_number}</TableCell>
                                    <TableCell>{serviceOrder.type}</TableCell>
                                    <TableCell>{serviceOrder.total}</TableCell>
                                    <TableCell>{serviceOrder.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
export default ServiceOrdersTable;