'use client'
import Link from "next/link";
import { useSession } from "@/providers/SessionProvider";


export default function CompleteProfile() {
    const user = useSession();
    return (
        !user?.has_completed_onboarding && (
            <div className="fixed top-0 left-0 w-full h-12 bg-red-400 text-white flex space-x-1.5 items-center justify-center">
                <p className="text-sm space-x-1.5">
                    Seu perfil ainda não está completo.
                </p>
                <Link href="configuracoes/perfil" className="underline text-white font-semibold">
                    Complete seu perfil
                </Link>
            </div>
        )
    );
}
