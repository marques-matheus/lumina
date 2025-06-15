import { create } from 'zustand';
import {type ServiceOrder} from '@/types';


interface ServiceOrderState {
    isDialogOpen: boolean;
    isEditing: boolean;
    selectedOrder: ServiceOrder | null;
    openModal: (order?: ServiceOrder) => void;
    closeModal: () => void;
    enterEditMode: () => void;
    exitEditMode: () => void;
    updateSelectedOrder: (order: ServiceOrder) => void
}

export const useServiceOrderStore = create<ServiceOrderState>((set)=>({
    //estados iniciais

    isDialogOpen: false,
    isEditing: false,
    selectedOrder: null,

    //funções que modificam os estados

    openModal: (order) => set(() => ({
        isDialogOpen: true,
        selectedOrder: order || null,
        isEditing: false,
    })),
    closeModal: () => set(() => ({
        isDialogOpen: false,
        selectedOrder: null,
    })),
    enterEditMode: () => set(() => ({
        isEditing: true,
    })),
    exitEditMode: () => set(() => ({
        isEditing: false,
        selectedOrder: null,
    })),
    updateSelectedOrder: (order) => set({ selectedOrder: order }),
}))