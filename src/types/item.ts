export interface Item {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  provider: string;
  description: string;
  discount?: string;
  expiry?: string;
  is_promotion?: boolean;
  created_at?: string;
}
