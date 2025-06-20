
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