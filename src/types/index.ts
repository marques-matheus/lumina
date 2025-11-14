
export type Client = {
  id: number;
  name: string;
  phone: string;
  is_active: boolean;
};

export type Product = {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  brand: string;
  cost_price?: number;
  sale_price: number;
  is_active: boolean;
};


export type ServiceOrder = {
  id: number;
  created_at: string;
  clients: Client;
  client_id: number; 
  type: string;
  equip_brand: string;
  equip_model: string;
  serial_number: string;
  items?: string;
  problem_description: string;
  status: string;
  total: number;
  delivered_at: string | null;
  completed_at: string | null;
};

export type PageProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type cartItem = {
  product: Product;
  quantity: number;
}

export type FormState = {
  success: boolean;
  message: string;
  updatedOrder?: ServiceOrder;
};

type userMetadata = {
  company_name?: string;
  cnpj?: string;
  does_provide_services?: boolean;
  has_completed_onboarding?: boolean;
  service_types?: string[];
}

export type User = {
  id: string;
  email?: string;
  user_metadata?: userMetadata;
  };
  
  export type Profile = {
  company_name?: string;
  cnpj?: string;
  does_provide_service?: boolean;
  has_completed_onboarding?: boolean;
  service_types?: string[];
  };

export type Address = {
  id: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  neighborhood: string;
  state: string;
  zip_code: string;
};

export type SessionUser = User & Profile & Address


export type SalesHistoryEntry = {
  id: number;
  created_at: string;
  total_amount: number;
  discount_amount?: number;
  clients: {
    name: string;
  } | null;
  sale_items: {
    quantity: number;
    products: Product;
  }[];
};

export type MonthlyFinancials = {
total_revenue: number;
total_costs: number;
gross_profit: number;
};

export type Purchase = {
  id: number;
  supplier: string;
  purchase_date: string;
  cost_per_unit: number;
  quantity: number;
  products?: {
    name: string;
    brand: string;
  } | null;
};