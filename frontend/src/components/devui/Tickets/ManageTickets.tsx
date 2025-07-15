"use client";

import React, { useState, useMemo } from "react";
import { useUser } from "@/hooks/useUser";
import { useGetTicketsByManagerQuery } from "@/state/api";
import { TicketCard } from "./TicketCard";
import { TicketByLandlordDto } from "./types";

type Status = "urgent" | "concerning" | "warning";

export const ManageTickets: React.FC = () => {
  const user = useUser();
  const managerCognitoId = user?.username;

  const { data, error, isLoading } = useGetTicketsByManagerQuery(
    { managerCognitoId: managerCognitoId! },
    { skip: !managerCognitoId }
  );

  const ticketsArray = Array.isArray(data) ? data : [];
  const [dealtWithMap, setDealtWithMap] = useState<Record<number, boolean>>({});
  const handleDealWith = (id: number) => {
    setDealtWithMap((prev) => ({ ...prev, [id]: true }));
  };

  const ticketsWithDealtWith = useMemo(() => {
    return ticketsArray.map((t: TicketByLandlordDto) => ({
      ...t,
      dealtWith: dealtWithMap[t.id] ?? false,
    }));
  }, [ticketsArray, dealtWithMap]);

  const statusOrder: Record<Status, number> = {
    urgent: 0,
    concerning: 1,
    warning: 2,
  };

  const sortedTickets = useMemo(() => {
    return [...ticketsWithDealtWith].sort((a, b) => {
      if (a.dealtWith === b.dealtWith) {
        const aStatus = a.status as Status;
        const bStatus = b.status as Status;
        if (aStatus in statusOrder && bStatus in statusOrder) {
          if (statusOrder[aStatus] !== statusOrder[bStatus]) {
            return statusOrder[aStatus] - statusOrder[bStatus];
          }
        }
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      }
      return a.dealtWith ? 1 : -1;
    });
  }, [ticketsWithDealtWith]);

  if (!managerCognitoId) return <div className="text-red-500">User not found</div>;
  if (isLoading) return <div>Loading tickets...</div>;
  if (error) return <div className="text-red-500">Error loading tickets</div>;

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold">Manage Tickets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {sortedTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} onDealWith={handleDealWith} />
        ))}
      </div>
    </div>
  );
};
