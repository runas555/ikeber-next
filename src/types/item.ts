export interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  provider: string;
  description: string;
  region: string;
  discount?: number;
  expiry?: string;
  is_promotion?: boolean;
  created_at?: string;
}
