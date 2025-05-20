export interface Item {
  id: string;
  name: string;
  category: string;
  price: number | string;
  image: string;
  provider: string;
  description: string;
  region: string;
  discount?: number | string;
  expiry?: string;
  is_promotion?: boolean;
  is_service?: boolean;
  created_at?: string;
}
