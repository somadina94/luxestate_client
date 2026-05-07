export interface Favorite {
  id: number | string;
  property_id: number | string;
  user_id: number | string;
  title?: string | null;
  property_title?: string | null;
  overview_image: string;
  address: string;
  price: number;
  currency: string;
  year_built: number;
  created_at: Date;
}
