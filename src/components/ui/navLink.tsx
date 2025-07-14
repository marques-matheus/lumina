import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    text: string;
    href?: string;

}
export default function NavLink({ text, href }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path ? 'border-teal-700 bg-gray-200 dark:bg-zinc-500' : '';
    return (
        <Link href={href ? href : `/${text}`} className={`px-4 py-2 hover:border-teal-700 text-lg border-l-8 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 in-dark:hover:bg-zinc-500 ${isActive(href ? href : `/${text}`)}`}>
            {text.charAt(0).toUpperCase() + text.slice(1)}
        </Link>

    );
}
