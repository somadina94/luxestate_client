export interface TicketMessage {
  id?: number | string;
  ticket_id: number | string;
  sender_id: number | string;
  sender?: {
    id: number | string;
    first_name: string;
    last_name: string;
    email?: string;
  };
  message: string;
  created_at?: string;
}
