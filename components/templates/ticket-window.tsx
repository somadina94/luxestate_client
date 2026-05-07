"use client";

import TicketWindow from "@/components/organisms/ticket-window";
import { useParams } from "next/navigation";
import { useAppSelector, RootState, AuthState } from "@/store";

export default function TicketWindowTemplate() {
  const { id } = useParams();
  const ticketId = (Array.isArray(id) ? id[0] : id) ?? "";
  const { user, access_token } = useAppSelector(
    (state: RootState) => state.auth,
  ) as AuthState;

  return (
    <div className="h-full min-h-0 flex flex-col">
      <TicketWindow
        key={ticketId}
        ticketId={ticketId}
        userId={user?.id ?? ""}
        accessToken={access_token}
      />
    </div>
  );
}
