import { TicketMessage } from "./ticket-message";

type TicketUser = {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
};

export interface Ticket {
  id?: number | string;
  user_id?: number | string;
  title: string;
  user?: TicketUser;
  messages?: TicketMessage[];
  status?: string;
  created_at?: string;
}
