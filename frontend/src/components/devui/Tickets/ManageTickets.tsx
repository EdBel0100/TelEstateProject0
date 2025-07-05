"use client";
//here is what i need here 
//1) The shared state for the tickets
//2) the logic for telling the backend to delete a specific card after marked as delt with 
//3) On render we want to fetch the data from the backend to display the cards

import { useState } from "react";
import { TicketCard } from "./TicketCard";
import { Ticket } from "./types";

const initialTickets: Ticket[] = [
  {
    id: "1",
    user: "John Doe",
    building: "123 Main St",
    submittedAt: "2025-07-01T09:30:00Z",
    status: "urgent",
    title: "Leaking Pipe - Apt 301",
    description: "There's a major leak under the kitchen sink.",
    dealtWith: false,
  },
  {
    id: "2",
    user: "Jane Smith",
    building: "456 Park Ave",
    submittedAt: "2025-07-01T10:15:00Z",
    status: "concerning",
    title: "Heating Issue - Apt 102",
    description: "Radiators aren't heating up properly.",
    dealtWith: false,
  },
  {
    id: "3",
    user: "Tom Johnson",
    building: "789 Elm St",
    submittedAt: "2025-07-01T08:50:00Z",
    status: "warning",
    title: "Window Jammed - Apt 404",
    description: "Bedroom window won’t close completely.",
    dealtWith: false,
  },
  // Add more as needed...
];

export const ManageTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const handleDealWith = (id: string) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, dealtWith: true } : ticket
      )
    );
  };

  // Sort: non-dealtWith first, then dealtWith
  const sortedTickets = [...tickets].sort((a, b) => {
    if (a.dealtWith === b.dealtWith) {
      // If same dealtWith status, sort by severity then time
      const statusOrder = { urgent: 0, concerning: 1, warning: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    }
    return a.dealtWith ? 1 : -1; // push dealtWith to bottom
  });

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
