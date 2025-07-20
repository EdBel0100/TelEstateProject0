"use client";

import React from "react";
import Modal from "react-modal";
import { IconX, IconMail, IconPhone } from "@tabler/icons-react";

interface TenantModalProps {
  apartmentNumber: string;
  tenants: {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    cognitoId: string;
  }[];
  onClose: () => void;
}

export const TenantModal: React.FC<TenantModalProps> = ({
  apartmentNumber,
  tenants,
  onClose,
}) => {
  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      contentLabel="Tenant Info"
      className="bg-white dark:bg-neutral-900 p-6 rounded-md max-w-lg mx-auto mt-20 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tenants for Apt {apartmentNumber}</h2>
        <IconX className="cursor-pointer hover:text-gray-600" onClick={onClose} />
      </div>

      {tenants.length === 0 ? (
        <p className="text-gray-500 italic">No tenants assigned to this unit.</p>
      ) : (
        <ul className="space-y-4 max-h-96 overflow-y-auto">
          {tenants.map((tenant) => (
            <li
              key={tenant.cognitoId}
              className="border border-gray-200 dark:border-neutral-700 rounded-md p-4"
            >
              <p className="text-lg font-medium">
                {tenant.firstName} {tenant.lastName}
              </p>
              {tenant.email && (
                <p className="flex items-center text-sm mt-1">
                  <IconMail size={16} className="mr-2 text-gray-500" />
                  {tenant.email}
                </p>
              )}
              {tenant.phoneNumber && (
                <p className="flex items-center text-sm mt-1">
                  <IconPhone size={16} className="mr-2 text-gray-500" />
                  {tenant.phoneNumber}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};
