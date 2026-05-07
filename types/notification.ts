export interface Notification {
  id?: number | string;
  title: string;
  body: string;
  payload: string;
  is_read: boolean;
  created_at: Date;
}
