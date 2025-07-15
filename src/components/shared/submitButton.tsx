// src/components/shared/SubmitButton.tsx
'use client';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

type props = {
  text?: string;
  form?: string;
};

export function SubmitButton({ text = 'Salvar', form }: props) {
  const { pending } = useFormStatus();

  return (
    <Button form={form} type="submit" disabled={pending} className='dark:bg-teal-700 dark:text-white'>
      {pending ? <span className="animate-pulse text-muted-foreground animation-duration-initial">...</span> : `${text}`}
    </Button>
  );
}