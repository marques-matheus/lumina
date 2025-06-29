'use client'
import { createContext, useContext } from 'react';
import { type SessionUser } from '@/types';


export const SessionContext = createContext<SessionUser | null>(null);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};

export const SessionProvider = ({ user, children }: {
    user: SessionUser | null;
    children: React.ReactNode;
}) => {
    return (
        <SessionContext.Provider value={user}>
            {children}
        </SessionContext.Provider>
    );
}

