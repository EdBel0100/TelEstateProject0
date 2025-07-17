"use client";

import React, { useEffect, useState } from "react";
import { useCreateBuildingForManagerMutation } from "@/state/api";
import type { CreateBuildingDto, LocationDto, PropertyDto } from "@DTO/building-dto/create-building.dto";
import { useUser } from "@/hooks/useUser";
import { useGetBuildingsByManagerQuery } from "@/state/api";

export interface BuildingCreateFormProps {
  onSubmit: (data: CreateBuildingDto) => void;
  onCancel: () => void;
}




export const BuildingCreateForm: React.FC<BuildingCreateFormProps> = ({ onSubmit, onCancel }) => {
  const user = useUser();
  const managerCognitoId = user?.username;
  const {
    refetch,
  } = useGetBuildingsByManagerQuery(
    { managerCognitoId: managerCognitoId! },
    { skip: !managerCognitoId }
  );
  

  const [createBuildingForManager, { isLoading, error }] = useCreateBuildingForManagerMutation();
  
  const [formData, setFormData] = useState<CreateBuildingDto>({
    name: "",
    photosUrl: "",
    typeOfBuilding: "",
    numberOfProperty: 0,
    managerCognitoId: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    properties: [],
  });

  useEffect(() => {
    if (managerCognitoId) {
      setFormData((prev) => ({ ...prev, managerCognitoId }));
    }
  }, [managerCognitoId]);

  const handleFieldChange = (
    field: Exclude<keyof Omit<CreateBuildingDto, "location" | "properties">, "managerCognitoId">,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field: keyof LocationDto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handlePropertyCountChange = (value: number) => {
    setFormData((prev) => {
      const currentCount = prev.properties?.length ?? 0;
      let newProperties = prev.properties ?? [];

      if (value > currentCount) {
        const additions: PropertyDto[] = Array(value - currentCount).fill({
          apartmentNumber: "",
          numberOfRooms: 0,
          numberOfBathrooms: 0,
          size: 0,
        });
        newProperties = [...newProperties, ...additions];
      } else {
        newProperties = newProperties.slice(0, value);
      }

      return {
        ...prev,
        numberOfProperty: value,
        properties: newProperties,
      };
    });
  };

  const updateProperty = (index: number, field: keyof PropertyDto, value: any) => {
    setFormData((prev) => {
      if (!prev.properties) return prev;
      const updatedProperties = [...prev.properties];
      updatedProperties[index] = { ...updatedProperties[index], [field]: value };
      return { ...prev, properties: updatedProperties };
    });
  };

  const removeProperty = (index: number) => {
    setFormData((prev) => {
      if (!prev.properties) return prev;
      const updatedProperties = prev.properties.filter((_, i) => i !== index);
      return { ...prev, properties: updatedProperties, numberOfProperty: updatedProperties.length };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.managerCognitoId.trim()) {
      console.error("Manager Cognito ID is missing.");
      return;
    }

    try {
      const createdBuilding = await createBuildingForManager(formData).unwrap();
      console.log("Building created:", createdBuilding);
      onSubmit(createdBuilding);
      await refetch()
    } catch (err) {
      console.error("Failed to create building:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div>
        <label className="block font-semibold mb-1">Building Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Type of Building</label>
        <input
          type="text"
          value={formData.typeOfBuilding}
          onChange={(e) => handleFieldChange("typeOfBuilding", e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Photo URL</label>
        <input
          type="text"
          value={formData.photosUrl}
          onChange={(e) => handleFieldChange("photosUrl", e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <fieldset className="border rounded p-4">
        <legend className="font-semibold mb-2">Location</legend>
        {(["address", "city", "state", "country", "postalCode"] as (keyof LocationDto)[]).map((field) => (
          <div key={field} className="mb-3">
            <label className="block capitalize mb-1">{field}</label>
            <input
              type="text"
              value={formData.location[field]}
              onChange={(e) => handleLocationChange(field, e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}
      </fieldset>

      <div>
        <label className="block font-semibold mb-1">Number of Properties</label>
        <input
          type="number"
          min={0}
          value={formData.numberOfProperty === 0 ? "" : formData.numberOfProperty}
          onChange={(e) => handlePropertyCountChange(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
      </div>

      <fieldset className="border rounded p-4">
        <legend className="font-semibold mb-2">Properties</legend>
        {formData.properties?.map((prop, i) => (
          <div key={i} className="border p-3 rounded mb-4 relative bg-gray-50 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => removeProperty(i)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
            >
              ×
            </button>

            <div className="mb-2">
              <label className="block mb-1 font-semibold">Apartment Number</label>
              <input
                type="text"
                value={prop.apartmentNumber}
                onChange={(e) => updateProperty(i, "apartmentNumber", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Rooms</label>
                <input
                  type="number"
                  min={0}
                  value={prop.numberOfRooms}
                  onChange={(e) => updateProperty(i, "numberOfRooms", Number(e.target.value))}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Bathrooms</label>
                <input
                  type="number"
                  min={0}
                  value={prop.numberOfBathrooms}
                  onChange={(e) => updateProperty(i, "numberOfBathrooms", Number(e.target.value))}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Size (sq ft)</label>
                <input
                  type="number"
                  min={0}
                  value={prop.size}
                  onChange={(e) => updateProperty(i, "size", Number(e.target.value))}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          </div>
        ))}
      </fieldset>

      <div className="flex justify-end space-x-2 mt-6">
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
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          {isLoading ? "Creating..." : "Submit"}
        </button>
      </div>

      {error && (
        <p className="text-red-600 mt-2">
          {(error as any).data?.message || "Error creating building"}
        </p>
      )}
    </form>
  );
};
