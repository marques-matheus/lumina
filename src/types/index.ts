
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
};

export type PageProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
  does_provide_services?: boolean;
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