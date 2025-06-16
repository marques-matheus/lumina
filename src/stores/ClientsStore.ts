import { create } from "zustand";
import {type Client} from "@/types";

interface ClientsState {
    isDialogOpen: boolean;
    selectedClient: Client | null;
    openModal: (client?: Client) => void;
    closeModal: () => void;
    updateSelectedClient: (client: Client) => void;
}

export const useClientsStore = create<ClientsState>((set) => ({
    isDialogOpen: false,
    selectedClient: null,

    openModal: (client) => set(() => ({
        isDialogOpen: true,
        selectedClient: client || null,
    })),
    closeModal: () => set(() => ({
        isDialogOpen: false,
        selectedClient: null,
    })),
    updateSelectedClient: (client) => set({ selectedClient: client }),
}));