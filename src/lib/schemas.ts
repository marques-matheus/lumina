import { z } from 'zod';

export const profileFormSchema = z.object({
  company_name: z.string().min(3, { message: "O nome da empresa deve ter pelo menos 3 caracteres." }),
  cnpj: z.string().regex(/^\d{14}$/, { message: "CNPJ inválido. Digite apenas números, sem pontos ou traços." }),
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
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirm_password: z.string().min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres." }),
}).refine((data) => data.password === data.confirm_password, {
  message: "As senhas não coincidem.",
  path: ["confirm_password"],
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;