import { z } from 'zod';

// Função para validar CNPJ real
export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[\.\-\/]/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  tamanho++;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  return true;
}

export const profileFormSchema = z.object({
  company_name: z.string().min(3, { message: "O nome da empresa deve ter pelo menos 3 caracteres." }),
  cnpj: z.string()
    .regex(/^\d{14}$/, { message: "CNPJ inválido. Digite apenas números, sem pontos ou traços." })
    .refine(isValidCNPJ, { message: "CNPJ inválido. Digite um CNPJ real." }),
  zip_code: z.string().regex(/^\d{8}$/, { message: "CEP inválido. Digite apenas números." }),
  street: z.string().min(3, { message: "O nome da rua é obrigatório." }),
  number: z.string().min(1, { message: "O número é obrigatório." }),
  neighborhood: z.string().min(3, { message: "O bairro é obrigatório." }),
  city: z.string().min(3, { message: "A cidade é obrigatória." }),
  state: z.string().length(2, { message: "Digite a sigla do estado (ex: RJ)." }),
  complement: z.string().optional(),
  does_provide_service: z.boolean(), // Alterado para boolean
  service_types: z.string().optional(),
});

export const registerFormSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
    .regex(/[A-Za-z]/, { message: "A senha deve conter pelo menos uma letra." })
    .regex(/[^A-Za-z0-9]/, { message: "A senha deve conter pelo menos um símbolo." }),
  confirm_password: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "As senhas não coincidem.",
      path: ["confirm_password"],
    });
  }
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;