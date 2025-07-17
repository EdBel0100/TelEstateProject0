"use client";

import React, { useState, useEffect } from "react";
import { UpdateBuildingDto, LocationUpdateDto, PropertyUpdateDto } from "@DTO/building-dto/update-building.dto"
import { useUpdateBuildingMutation } from "@/state/api";
import { useGetBuildingsByManagerQuery } from "@/state/api";
import { useUser } from "@/hooks/useUser";



interface BuildingUpdateFormProps {
  initialData: UpdateBuildingDto;
  onCancel: () => void;
  onSubmit: (updated: any) => void;
}

export const BuildingUpdateForm: React.FC<BuildingUpdateFormProps> = ({
  initialData,
  onCancel,
  onSubmit,
}) => {
  const [updateBuilding, { isLoading, error }] = useUpdateBuildingMutation();
  const user = useUser();
  const managerCognitoId = user?.username;

const {
  refetch, 
} = useGetBuildingsByManagerQuery(
  { managerCognitoId: managerCognitoId! },
  { skip: !managerCognitoId }
);

  const [formData, setFormData] = useState<UpdateBuildingDto>(initialData);

  // Update top-level fields
  const handleFieldChange = (field: keyof Omit<UpdateBuildingDto, "location" | "properties">, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Location field change
  const handleLocationChange = (field: keyof LocationUpdateDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location!,
        [field]: value,
      },
    }));
  };

  // Properties logic
  const updateProperty = (index: number, field: keyof PropertyUpdateDto, value: any) => {
    if (!formData.properties) return;
    const updated = [...formData.properties];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, properties: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Create a shallow copy so we can remove locationId without mutating state directly
    const dataToSend = { ...formData };
  
    // Remove locationId if it exists at top level or inside location
    if ("locationId" in dataToSend) {
      delete dataToSend.locationId;
    }
    if (dataToSend.location && "locationId" in dataToSend.location) {
      delete dataToSend.location.locationId;
    }
  
    console.log("FormData before update (without locationId):", dataToSend);
  
    try {
      const updated = await updateBuilding(dataToSend).unwrap();
      console.log("Building updated:", updated);
      onSubmit(updated);
      await refetch(); 
    } catch (err) {
      console.error("Failed to update building:", err);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
  
      <div>
        <label className="block font-semibold mb-1">Building Name</label>
        <input
          type="text"
          value={formData.name ?? ""}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
  
      <div>
        <label className="block font-semibold mb-1">Type of Building</label>
        <input
          type="text"
          value={formData.typeOfBuilding ?? ""}
          onChange={(e) => handleFieldChange("typeOfBuilding", e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
  
      <div>
        <label className="block font-semibold mb-1">Photo URL</label>
        <input
          type="text"
          value={formData.photosUrl ?? ""}
          onChange={(e) => handleFieldChange("photosUrl", e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
  
      {/* Location Section */}
      <fieldset className="border rounded p-4">
        <legend className="font-semibold mb-2">Location</legend>
        {formData.location &&
          (["address", "city", "state", "country", "postalCode"] as (keyof LocationUpdateDto)[]).map((field) => (
            <div key={field} className="mb-3">
              <label className="block capitalize mb-1">{field}</label>
              <input
                type="text"
                value={formData.location?.[field] ?? ""}
                onChange={(e) => handleLocationChange(field, e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}
      </fieldset>
  
      {/* Properties Section */}
      <fieldset className="border rounded p-4">
        <legend className="font-semibold mb-2">Properties</legend>
  
        {formData.properties?.map((prop, i) => (
          <div key={i} className="relative border p-3 rounded mb-4 bg-gray-50 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => {
                const updated = formData.properties?.filter((_, index) => index !== i);
                setFormData((prev) => ({
                  ...prev,
                  properties: updated,
                }));
              }}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
            >
              ✕
            </button>
  
            <div className="mb-2">
              <label className="block font-semibold mb-1">Apartment Number</label>
              <input
                type="text"
                value={prop.apartmentNumber ?? ""}
                onChange={(e) => updateProperty(i, "apartmentNumber", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
  
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Rooms</label>
                <input
                  type="number"
                  value={prop.numberOfRooms ?? ""}
                  onChange={(e) =>
                    updateProperty(i, "numberOfRooms", e.target.value === "" ? null : Number(e.target.value))
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Bathrooms</label>
                <input
                  type="number"
                  value={prop.numberOfBathrooms ?? ""}
                  onChange={(e) =>
                    updateProperty(i, "numberOfBathrooms", e.target.value === "" ? null : Number(e.target.value))
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Size (sq ft)</label>
                <input
                  type="number"
                  value={prop.size ?? ""}
                  onChange={(e) =>
                    updateProperty(i, "size", e.target.value === "" ? null : Number(e.target.value))
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          </div>
        ))}
  
        {/* Add Property button below all properties */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                properties: [
                  ...(prev.properties ?? []),
                  {
                    apartmentNumber: "",
                    numberOfRooms: 0,
                    numberOfBathrooms: 0,
                    size: 0,
                  },
                ],
              }))
            }
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            + Add Property
          </button>
        </div>
      </fieldset>
  
      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
  
      {error && <p className="text-red-600 mt-2">{(error as any).data?.message || "Update failed"}</p>}
    </form>
  );
          }