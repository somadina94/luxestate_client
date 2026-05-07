export type Conversation = {
  id?: number | string;
  user_id: number | string;
  agent_id?: number | string | null;
  admin_id?: number | string | null;
  property_id?: number | string | null;
  type: string;
  user_first_name?: string | null;
  user_last_name?: string | null;
  agent_first_name?: string | null;
  agent_last_name?: string | null;
  property_title?: string | null;
};
