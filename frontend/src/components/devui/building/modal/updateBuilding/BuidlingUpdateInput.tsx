"use client";

import React, { useState } from "react";
import {
  UpdateBuildingDto,
  LocationUpdateDto,
  PropertyUpdateDto,
  LeaseUpdateDto,
} from "@DTO/building-dto/update-building.dto";
import { useUpdateBuildingMutation } from "@/state/api";
import { useGetBuildingsByManagerQuery } from "@/state/api";
import { useUser } from "@/hooks/useUser";
import { skipToken } from "@reduxjs/toolkit/query";


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
  const managerCognitoId = user?.attributes.sub;

  const { refetch } = useGetBuildingsByManagerQuery(
    managerCognitoId ? { managerCognitoId } : skipToken
  );

  // Always call hooks first:
  const [formData, setFormData] = useState<UpdateBuildingDto>(() => {
    // Defensive initialization in case initialData is undefined or null
    if (!initialData) {
      // Provide some safe default or empty data here
      return {
        id: 0,
        name: "",
        managerCognitoId: "",
        photosUrl: "",
        typeOfBuilding: "residential",
        numberOfProperty: 0,
        location: {
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
        properties: [],
      };
    }
    // Otherwise initialize normally:
    return {
      id: initialData.id,
      name: initialData.name,
      managerCognitoId: initialData.managerCognitoId,
      photosUrl: initialData.photosUrl ?? "",
      typeOfBuilding: initialData.typeOfBuilding ?? "residential",
      numberOfProperty:
        initialData.numberOfProperty ?? initialData.properties?.length ?? 0,
      location: {
        address: initialData.location.address ?? "",
        city: initialData.location.city ?? "",
        state: initialData.location.state ?? "",
        country: initialData.location.country ?? "",
        postalCode: initialData.location.postalCode ?? "",
      },
      properties: initialData.properties?.map((prop) => ({
        id: prop.id,
        apartmentNumber: prop.apartmentNumber ?? "",
        numberOfRooms: prop.numberOfRooms ?? 0,
        numberOfBathrooms: prop.numberOfBathrooms ?? 0,
        size: prop.size ?? 0,
        lease: {
          startDate: prop.lease?.startDate ?? "",
          endDate: prop.lease?.endDate ?? "",
          deposit: prop.lease?.deposit ?? 0,
          typeOfLease: prop.lease?.typeOfLease ?? "",
          monthlyPrice: prop.lease?.monthlyPrice ?? 0,
          rentDueDateEachMonth: prop.lease?.rentDueDateEachMonth ?? 1,
          propertyId: prop.lease?.propertyId ?? prop.id ?? 0,
        },
      })) ?? [],
    };
  });

  // Now if you want to display an error or fallback UI if initialData is missing:
  if (!initialData) {
    return <h1>Could not fetch data</h1>;
  }

  
  
  
    

  // Top-level fields
  const handleFieldChange = (
    field: keyof Omit<UpdateBuildingDto, "location" | "properties">,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Location nested fields
  const handleLocationChange = (field: keyof LocationUpdateDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location!,
        [field]: value,
      },
    }));
  };

  // Property fields (excluding lease)
  const updateProperty = (
    index: number,
    field: keyof Omit<PropertyUpdateDto, "lease">,
    value: any
  ) => {
    if (!formData.properties) return;
    const updated = [...formData.properties];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, properties: updated }));
  };

  // Lease nested fields inside a property
  const updatePropertyLease = (
    propertyIndex: number,
    field: keyof LeaseUpdateDto,
    value: any
  ) => {
    if (!formData.properties) return;
    const updated = [...formData.properties];
    const existingLease = updated[propertyIndex].lease ?? {
      startDate: "",
      endDate: "",
      deposit: 0,
      typeOfLease: "",
      monthlyPrice: 0,
      rentDueDateEachMonth: 1,
      propertyId: updated[propertyIndex].id ?? 0,
    };
  
    updated[propertyIndex] = {
      ...updated[propertyIndex],
      lease: {
        ...existingLease,
        [field]: value,
      },
    };
  
    setFormData((prev) => ({ ...prev, properties: updated }));
  };
  
  

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data to send (remove locationId if any)
    const dataToSend = { ...formData };
    if ("locationId" in dataToSend) {
      delete dataToSend.locationId;
    }
    if (dataToSend.location && "locationId" in dataToSend.location) {
      delete dataToSend.location.locationId;
    }

    try {
      const updated = await updateBuilding(dataToSend).unwrap();
      onSubmit(updated);
      await refetch();
    } catch (err) {
      console.error("Failed to update building:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
  {/* Building fields */}
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

  {/* Location */}
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

  {/* Properties + Lease */}
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

        {/* Property fields */}
        <div className="mb-2">
          <label className="block font-semibold mb-1">Apartment Number</label>
          <input
            type="text"
            value={prop.apartmentNumber ?? ""}
            onChange={(e) => updateProperty(i, "apartmentNumber", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-3">
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

        {/* Lease nested fields */}
        <fieldset className="border rounded p-3 bg-white dark:bg-neutral-900">
          <legend className="font-semibold mb-2">Lease</legend>

          <div className="mb-2">
            <label className="block font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={prop.lease?.startDate?.slice(0, 10) ?? ""}
              onChange={(e) => updatePropertyLease(i, "startDate", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold mb-1">End Date</label>
            <input
              type="date"
              value={prop.lease?.endDate?.slice(0, 10) ?? ""}
              onChange={(e) => updatePropertyLease(i, "endDate", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold mb-1">Deposit</label>
            <input
              type="number"
              value={prop.lease?.deposit ?? ""}
              onChange={(e) =>
                updatePropertyLease(i, "deposit", e.target.value === "" ? null : Number(e.target.value))
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold mb-1">Type of Lease</label>
            <input
              type="text"
              value={prop.lease?.typeOfLease ?? ""}
              onChange={(e) => updatePropertyLease(i, "typeOfLease", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold mb-1">Monthly Price</label>
            <input
              type="number"
              value={prop.lease?.monthlyPrice ?? ""}
              onChange={(e) =>
                updatePropertyLease(i, "monthlyPrice", e.target.value === "" ? null : Number(e.target.value))
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-2">
            <label className="block font-semibold mb-1">Rent Due Date (Day of Month)</label>
            <input
              type="number"
              min={1}
              max={31}
              value={prop.lease?.rentDueDateEachMonth ?? ""}
              onChange={(e) =>
                updatePropertyLease(i, "rentDueDateEachMonth", e.target.value === "" ? null : Number(e.target.value))
              }
              className="w-full border p-2 rounded"
            />
          </div>
        </fieldset>
      </div>
    ))}

    {/* Add Property button */}
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
                lease: {
                  startDate: "",
                  endDate: "",
                  deposit: 0,
                  typeOfLease: "",
                  monthlyPrice: 0,
                  rentDueDateEachMonth: 1,
                  propertyId: 0, // Will be set server-side
                },
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

  {error && (
    <p className="text-red-600 mt-2">
      {(error as any).data?.message || "Update failed"}
    </p>
  )}
</form>

  );
};
