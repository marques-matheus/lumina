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

export const clientSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  phone: z.string().min(8, { message: "O telefone deve ter pelo menos 8 digitos." }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export const productSchema = z.object({
  name: z.string().min(3, { message: "O nome do produto deve ter pelo menos 3 caracteres." }),
  quantity: z.coerce.number().int().min(0, { message: "A quantidade deve ser um número positivo." }),
  description: z.string().min(3, { message: "A descrição deve ter pelo menos 3 caracteres." }),
  sale_price: z.coerce.number().min(0, { message: "O preço de venda deve ser um número positivo." }),
  brand: z.string().min(2, { message: "A marca deve ter pelo menos 2 caracteres." }),
});

export type ClientFormData = z.infer<typeof clientSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProductFormData = z.infer<typeof productSchema>;

export const purchaseSchema = z.object({
  product_id: z.coerce.number().int().positive({ message: "Selecione um produto." }),
  quantity: z.coerce.number().int().min(1, { message: "A quantidade deve ser no mínimo 1." }),
  cost_per_unit: z.coerce.number().min(0, { message: "O custo deve ser um número positivo." }),
  purchase_date: z.coerce.date().refine((date) => !isNaN(date.getTime()), { message: "Data inválida." }),
  supplier: z.string().optional(),
});

export type PurchaseFormData = z.infer<typeof purchaseSchema>;

const cartItemSchema = z.object({
  product: z.object({
    id: z.number().int().positive(),
    sale_price: z.number().min(0),
  }),
  quantity: z.number().int().min(1),
});

export const saleSchema = z.object({
  cartItems: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return z.array(cartItemSchema).nonempty().safeParse(parsed).success;
    } catch {
      return false;
    }
  }, { message: "Carrinho inválido." }),
  totalAmount: z.coerce.number().min(0, { message: "O valor total deve ser um número positivo." }),
  discountAmount: z.coerce.number().min(0).optional().default(0),
  clientId: z.coerce.number().int().positive().optional().nullable(),
});

export type SaleFormData = z.infer<typeof saleSchema>;

export const serviceOrderStatusSchema = z.enum([
    "Aguardando Avaliação",
    "Aguardando Aprovação",
    "Aprovado",
    "Em Andamento",
    "Em Reparo",
    "Aguardando Peças",
    "Concluído",
    "Entregue",
    "Cancelado",
]);

export const serviceOrderSchema = z.object({
    clientId: z.coerce.number().int().positive({ message: "Selecione um cliente." }),
    equip_brand: z.string().min(2, { message: "A marca deve ter pelo menos 2 caracteres." }),
    equip_model: z.string().min(2, { message: "O modelo deve ter pelo menos 2 caracteres." }),
    serial_number: z.string().min(1, { message: "O número de série é obrigatório." }),
    problem_description: z.string().min(10, { message: "A descrição do problema deve ter pelo menos 10 caracteres." }),
    items: z.string().optional(),
    type: z.string().min(3, { message: "O tipo de serviço é obrigatório." }),
    total: z.coerce.number().min(0, { message: "O valor total deve ser um número positivo." }),
});

export type ServiceOrderFormData = z.infer<typeof serviceOrderSchema>;

// Schema para cancelamento de venda com senha
export const cancelSaleSchema = z.object({
  saleId: z.coerce.number().int().positive({ message: "ID da venda inválido." }),
  password: z.string().min(1, { message: "A senha é obrigatória para cancelar a venda." }),
});

export type CancelSaleFormData = z.infer<typeof cancelSaleSchema>;

export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;