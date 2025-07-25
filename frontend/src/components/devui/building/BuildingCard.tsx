"use client";

import React, { useState } from "react";
import Modal from "react-modal";
import { GetBuildingByManagerDto } from "@DTO/building-dto/get-building-by-managerCognitoId.dto";
import { IconPencil, IconTrash, IconSend } from "@tabler/icons-react";
import Image from "next/image";

interface BuildingCardProps {
  building: GetBuildingByManagerDto;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  onEdit,
  onDelete,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<
  GetBuildingByManagerDto["properties"][0]["tenants"]
  >([]);
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null);

  const openModal = (
    apartmentNumber: string | undefined | null,
    tenants: GetBuildingByManagerDto["properties"][0]["tenants"]
  ) => {
    setSelectedApartment(apartmentNumber || "N/A");
    setSelectedTenants(tenants);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-bold mb-2">{building.name}</h3>
        <div className="flex flex-row space-x-1">
          <IconPencil
            className="hover:text-gray-500 cursor-pointer"
            onClick={onEdit}
          />
          <IconTrash
            className="hover:text-gray-500 cursor-pointer text-red-700"
            onClick={onDelete}
          />
        </div>
      </div>

      <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
  <Image
    src={building.photosUrl}
    alt={building.name}
    fill
    style={{ objectFit: 'cover' }}
  />
</div>

      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-3">
        <p><strong>Type:</strong> {building.typeOfBuilding}</p>
        <p><strong>Properties:</strong> {building.numberOfProperty}</p>
        <p>
          <strong>Location:</strong> {building.location.address},{" "}
          {building.location.city}, {building.location.state},{" "}
          {building.location.country}, {building.location.postalCode}
        </p>
      </div>

      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Units & Tenants:</h4>
        <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {building.properties.map((prop) => (
            <li
              key={prop.id}
              className="p-3 bg-gray-50 dark:bg-neutral-800 rounded border border-gray-200 dark:border-neutral-700"
            >
              <button
                type="button"
                onClick={() => openModal(prop.apartmentNumber, prop.tenants)}
                className="block w-full text-left hover:underline"
              >
                <p>
                  <strong>Apt:</strong> {prop.apartmentNumber || "N/A"}
                </p>
              </button>
              {prop.tenants.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No tenants</p>
              ) : (
                <ul className="text-sm mt-1 ml-2 list-disc">
                  {prop.tenants.map((tenant, i) => (
                    <li key={`${tenant.cognitoId}-${i}`}>
                      {tenant.firstName} {tenant.lastName}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for Tenant Info */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Tenant Information"
        className="max-w-lg mx-auto my-10 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        ariaHideApp={false} // to avoid ReactModal error for #__next
      >
        <h2 className="text-xl font-bold mb-4">
          Tenants for Apartment: {selectedApartment}
        </h2>
        {selectedTenants.length === 0 ? (
          <p>No tenants found.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {selectedTenants.map((tenant, idx) => (
              <li
                key={`${tenant.cognitoId}-${idx}`}
                className="border border-gray-300 dark:border-neutral-700 rounded p-4 flex justify-between items-center"
              >
                <div>
                  <p><strong>Name:</strong> {tenant.firstName} {tenant.lastName}</p>
                  {tenant.email && (
                    <p><strong>Email:</strong> {tenant.email}</p>
                  )}
                  {tenant.phoneNumber && (
                    <p><strong>Phone:</strong> {tenant.phoneNumber}</p>
                  )}
                </div>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800"
                  title="Send Message"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconSend size={20} />
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};
