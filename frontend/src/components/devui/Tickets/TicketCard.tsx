import React from "react";
import { TicketByLandlordDto } from "./types";

interface TicketCardProps {
  ticket: TicketByLandlordDto & { dealtWith?: boolean };
  onDealWith: (id: number) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onDealWith }) => {
  const statusColors = {
    urgent: "bg-red-500",
    concerning: "bg-orange-400",
    warning: "bg-yellow-400",
  } as const;

  const statusColor = statusColors[ticket.status as keyof typeof statusColors];

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-4 border border-neutral-200 dark:border-neutral-700">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs px-2 py-1 rounded-full text-white ${statusColor}`}>
          {ticket.status.toUpperCase()}
        </span>
        {ticket.dealtWith && (
          <span className="text-xs text-pink-500 font-medium">Dealt With</span>
        )}
      </div>
      <h3 className="font-semibold">{ticket.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ticket.description}</p>

      <p className="text-xs text-gray-500">
        <strong>Apartment:</strong> {ticket.property.apartmentNumber}
      </p>

      <p className="text-xs text-gray-500">
  <strong>Building Address:</strong> {ticket.property.building.location.address}
</p>

      <p className="text-xs text-gray-400">
        <strong>Submitted:</strong> {new Date(ticket.submittedAt).toLocaleString()}
      </p>

      {!ticket.dealtWith && (
        <button
          onClick={() => onDealWith(ticket.id)}
          className="mt-3 text-xs text-blue-600 hover:underline"
        >
          Mark as Dealt With
        </button>
      )}
    </div>
  );
};
