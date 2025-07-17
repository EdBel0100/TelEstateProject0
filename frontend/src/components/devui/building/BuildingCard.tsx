"use client";

import React from "react";
import { BuildingGetManyDto } from "@DTO/building-dto/get-building-by-managerCognitoId.dto";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface BuildingCardProps {
  building: BuildingGetManyDto;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  onEdit,
  onDelete,
}) => {
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

      <img
        src={building.photosUrl}
        alt={building.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-3">
        <p>
          <strong>Type:</strong> {building.typeOfBuilding}
        </p>
        <p>
          <strong>Properties:</strong> {building.numberOfProperty}
        </p>
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
              <a href="#" className="block hover:underline">
                <p>
                  <strong>Apt:</strong> {prop.apartmentNumber || "N/A"}
                </p>
                {prop.tenants.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No tenants</p>
                ) : (
                  <ul className="text-sm mt-1 ml-2 list-disc">
                    {prop.tenants.map((tenant, i) => (
                      <li key={i}>
                        {tenant.firstName} {tenant.lastName}
                      </li>
                    ))}
                  </ul>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
