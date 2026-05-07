export interface PropertyImage {
  id: number | string;
  property_id: number | string;
  is_primary: boolean;
  alt_text: string;
  file_url: string;
  file_key: string;
  order_index: number;
  createdAt: Date;
}
