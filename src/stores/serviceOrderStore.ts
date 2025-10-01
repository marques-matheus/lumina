import { create } from 'zustand';
import { type ServiceOrder } from '@/types';

type ServiceOrderState = {
    isDialogOpen: boolean;
    isEditing: boolean;
    selectedOrder: ServiceOrder | null;
    openModal: (order: ServiceOrder) => void;
    closeModal: () => void;
    enterEditMode: () => void;
    exitEditMode: () => void;
    updateSelectedOrder: (order: ServiceOrder) => void;
};

export const useServiceOrderStore = create<ServiceOrderState>((set) => ({
    isDialogOpen: false,
    isEditing: false,
    selectedOrder: null,
    openModal: (order) => set({ isDialogOpen: true, selectedOrder: order, isEditing: false }),
    closeModal: () => set({ isDialogOpen: false, selectedOrder: null, isEditing: false }),
    enterEditMode: () => set({ isEditing: true }),
    exitEditMode: () => set({ isEditing: false }),
    updateSelectedOrder: (order) => set((state) => ({
        selectedOrder: state.selectedOrder ? { ...state.selectedOrder, ...order } : null,
    })),
}));
