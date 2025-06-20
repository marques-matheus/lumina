// src/components/shared/SubmitButton.tsx
'use client';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

type props = {
  text?: string;
};

export function SubmitButton({ text = 'Salvar' }: props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <span className="animate-pulse text-muted-foreground animation-duration-initial">...</span> : `${text}`}
    </Button>
  );
}