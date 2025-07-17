import React from "react";
import { TicketByLandlordDto } from "./types";

interface TicketCardProps {
  ticket: TicketByLandlordDto;
  isDeleted?: boolean;
  onDelete: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, isDeleted, onDelete }) => {
  const statusColors = {
    urgent: "bg-red-500",
    concerning: "bg-orange-400",
    warning: "bg-yellow-400",
  } as const;

  const statusColor = statusColors[ticket.status as keyof typeof statusColors];

  return (
    <div
      className={`bg-white dark:bg-neutral-900 rounded-lg shadow-md p-4 border border-neutral-200 dark:border-neutral-700 transition-opacity ${
        isDeleted ? "opacity-50 grayscale" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs px-2 py-1 rounded-full text-white ${statusColor}`}>
          {ticket.status.toUpperCase()}
        </span>
        {isDeleted && (
          <span className="text-xs text-gray-500 font-medium">Deleted</span>
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

      {!isDeleted && (
        <button
          onClick={onDelete}
          className="mt-3 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Delete Ticket
        </button>
      )}
    </div>
  );
};
