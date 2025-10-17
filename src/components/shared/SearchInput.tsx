'use client';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

export default function SearchInput({ placeholder }: { placeholder: string }) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget);
        const term = formData.get("search") as string;

        const params = new URLSearchParams(searchParams.toString());

        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }

        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <form onSubmit={handleSearch} className="flex items-center w-full" >
            <Input
                className="rounded-r-none flex-1"
                name="search"
                placeholder={placeholder}
                defaultValue={searchParams.get('search')?.toString() || ''}
            />
            <Button className="rounded-l-none flex-shrink-0" type="submit"><Search className="h-4 w-4" /></Button>
        </form>
    )

}