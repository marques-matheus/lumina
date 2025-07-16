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
{pending ? (
  <span className="flex items-center gap-2">
    <svg className="animate-spin h-5 w-5 text-muted-foreground" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  </span>
) : (
  `${text}`
)}    </Button>
  );
}