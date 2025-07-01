import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Página Não Encontrada</h1>
            <p className="text-lg mb-6">Desculpe, a página que você está procurando não existe.</p>
            <Button asChild variant="outline" className="w-48">
                <Link href="/">Voltar para a Página Inicial</Link>
            </Button>
        </div>
    );
}