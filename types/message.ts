export type Message = {
  id: number | string;
  conversation_id: number | string;
  sender_id: number | string;
  content: string;
  timestamp: string;
  is_read: boolean;
};

export type NewMessagePayload = {
  type: "new_message";
  conversation_id: number | string;
  message: Message;
};

export type DeliveredPayload = {
  type: "delivered";
  conversation_id: number | string;
  message_id: number | string;
  to: number | string;
};

export type ChatWSPayload = NewMessagePayload | DeliveredPayload;
