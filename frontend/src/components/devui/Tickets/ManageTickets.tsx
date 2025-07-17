"use client";

import React, { useMemo, useState } from "react";
import { useUser } from "@/hooks/useUser";
import {
  useGetTicketsByManagerQuery,
  useDeleteTicketMutation, // rename as appropriate
} from "@/state/api";
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

  const [deleteTicket] = useDeleteTicketMutation();

  const [deletedMap, setDeletedMap] = useState<Record<number, boolean>>({});

  const handleDelete = async (id: number) => {
    try {
      await deleteTicket({ id }).unwrap();
      setDeletedMap((prev) => ({ ...prev, [id]: true }));
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  };

  const ticketsArray = Array.isArray(data) ? data : [];

  const statusOrder: Record<Status, number> = {
    urgent: 0,
    concerning: 1,
    warning: 2,
  };

  const sortedTickets = useMemo(() => {
    return [...ticketsArray]
      .map((t) => ({
        ...t,
        isDeleted: deletedMap[t.id] ?? false,
      }))
      .sort((a, b) => {
        if (a.isDeleted !== b.isDeleted) {
          return a.isDeleted ? 1 : -1; // Deleted tickets go last
        }

        const aStatus = a.status as Status;
        const bStatus = b.status as Status;
        if (aStatus in statusOrder && bStatus in statusOrder) {
          if (statusOrder[aStatus] !== statusOrder[bStatus]) {
            return statusOrder[aStatus] - statusOrder[bStatus];
          }
        }

        return (
          new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        );
      });
  }, [ticketsArray, deletedMap]);

  if (!managerCognitoId) return <div className="text-red-500">User not found</div>;
  if (isLoading) return <div>Loading tickets...</div>;
  if (error) return <div className="text-red-500">Error loading tickets</div>;

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold">Manage Tickets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {sortedTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            isDeleted={ticket.isDeleted}
            onDelete={() => handleDelete(ticket.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageTickets;
