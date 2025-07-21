type Props = {
    title?: string;
    subtitle?: string;
}
export default function Heading({ title, subtitle }: Props) {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">
                {subtitle}
            </p>
        </div>
    );
}