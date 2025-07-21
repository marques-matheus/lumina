export default function Footer() {
    return (
        <footer className=" bg-white dark:bg-zinc-900 ">
            <div className="container py-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Lúmina. Todos os direitos reservados.</p>
                {/* <p>Feito com ❤️ pela equipe Lúmina</p> */}
            </div>
        </footer>
    );
}