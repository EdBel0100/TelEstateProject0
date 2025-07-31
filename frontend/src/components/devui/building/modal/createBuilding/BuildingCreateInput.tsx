"use client";

import React, { useState } from "react";
import { CreateBuildingDto, LeaseDto } from "@DTO/building-dto/create-building.dto";
import { useCreateBuildingForManagerMutation } from "@/state/api";
import { toast } from "sonner";

interface BuildingCreateFormProps {
  onSubmit: (data: CreateBuildingDto) => void;
  onCancel: () => void;
}

const initialForm: CreateBuildingDto = {
  name: "",
  managerCognitoId: "",
  photosUrl: "",
  typeOfBuilding: "",
  numberOfProperty: 1,
  location: {
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
  properties: [],
};

export const BuildingCreateForm: React.FC<BuildingCreateFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateBuildingDto>(initialForm);
  const [createBuilding, { isLoading }] = useCreateBuildingForManagerMutation();

  const handleInputChange = (field: keyof CreateBuildingDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (
    field: keyof CreateBuildingDto["location"],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const addProperty = () => {
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
            rentDueDateEachMonth: 1,
            monthlyPrice: 0,
            propertyId: 0,
          },
        },
      ],
    }));
  };

  const updateProperty = (
    index: number,
    field: keyof NonNullable<CreateBuildingDto["properties"]>[number],
    value: any
  ) => {
    setFormData((prev) => {
      const properties = [...(prev.properties ?? [])];
      properties[index] = { ...properties[index], [field]: value };
      return { ...prev, properties };
    });
  };

  const updateLease = (
    propertyIndex: number,
    leaseField: keyof LeaseDto,
    value: any
  ) => {
    const dateFields: (keyof LeaseDto)[] = ["startDate", "endDate"];
    const formattedValue =
      dateFields.includes(leaseField) && value
        ? new Date(value).toISOString()
        : leaseField === "rentDueDateEachMonth"
        ? parseInt(value, 10) || 1
        : leaseField === "monthlyPrice" || leaseField === "deposit"
        ? parseFloat(value) || 0
        : value;

    setFormData((prev) => {
      const properties = [...(prev.properties ?? [])];
      const property = properties[propertyIndex];
      if (!property) return prev;

      const lease = {
        ...(property.lease ?? {
          startDate: "",
          endDate: "",
          deposit: 0,
          typeOfLease: "",
          rentDueDateEachMonth: 1,
          monthlyPrice: 0,
          propertyId: 0,
        }),
        [leaseField]: formattedValue,
      };

      properties[propertyIndex] = { ...property, lease };

      return { ...prev, properties };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBuilding(formData).unwrap();
      toast.success("Building created successfully!");
      onSubmit(formData);
      setFormData(initialForm);
    } catch (error) {
      toast.error("Failed to create building.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded shadow max-h-[80vh] overflow-auto bg-white dark:bg-neutral-900"
    >
      <h2 className="text-xl font-semibold">Create Building</h2>

      <input
        type="text"
        placeholder="Building Name"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      {/* No Manager Cognito ID input here — assign server side or use user context */}

      <input
        type="text"
        placeholder="Photo URL"
        value={typeof formData.photosUrl === "string" ? formData.photosUrl : ""}
        onChange={(e) => handleInputChange("photosUrl", e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Type of Building"
        value={formData.typeOfBuilding}
        onChange={(e) => handleInputChange("typeOfBuilding", e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        min={0}
        placeholder="Number of Properties"
        value={formData.numberOfProperty}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          handleInputChange("numberOfProperty", isNaN(val) ? 0 : val);
        }}
        className="w-full border p-2 rounded"
      />

      <h3 className="font-semibold mt-4">Location</h3>

      {Object.entries(formData.location).map(([key, value]) => (
        <input
          key={key}
          type="text"
          placeholder={key}
          value={value}
          onChange={(e) =>
            handleLocationChange(key as keyof CreateBuildingDto["location"], e.target.value)
          }
          className="w-full border p-2 rounded mt-1"
        />
      ))}

      <div className="mt-6">
        <button
          type="button"
          onClick={addProperty}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Property
        </button>
      </div>

      {(formData.properties ?? []).map((prop, i) => (
        <div key={i} className="border p-4 mt-4 rounded space-y-2 bg-gray-50 dark:bg-neutral-800">
          <h4 className="font-semibold">Property #{i + 1}</h4>

          <input
            type="text"
            placeholder="Apartment Number"
            value={prop.apartmentNumber}
            onChange={(e) => updateProperty(i, "apartmentNumber", e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            min={0}
            placeholder="Rooms"
            value={prop.numberOfRooms}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              updateProperty(i, "numberOfRooms", isNaN(val) ? 0 : val);
            }}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            min={0}
            placeholder="Bathrooms"
            value={prop.numberOfBathrooms}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              updateProperty(i, "numberOfBathrooms", isNaN(val) ? 0 : val);
            }}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            min={0}
            placeholder="Size (sqft)"
            value={prop.size}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              updateProperty(i, "size", isNaN(val) ? 0 : val);
            }}
            className="w-full border p-2 rounded"
          />

          <h5 className="font-semibold mt-2">Lease</h5>

          <input
            type="date"
            value={prop.lease?.startDate?.slice(0, 10) ?? ""}
            onChange={(e) => updateLease(i, "startDate", e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            value={prop.lease?.endDate?.slice(0, 10) ?? ""}
            onChange={(e) => updateLease(i, "endDate", e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Deposit"
            value={prop.lease?.deposit ?? ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              updateLease(i, "deposit", isNaN(val) ? 0 : val);
            }}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Type of Lease"
            value={prop.lease?.typeOfLease ?? ""}
            onChange={(e) => updateLease(i, "typeOfLease", e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            min={1}
            max={28}
            placeholder="Rent Due Day (1–28)"
            value={prop.lease?.rentDueDateEachMonth ?? ""}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              updateLease(i, "rentDueDateEachMonth", isNaN(val) ? 1 : val);
            }}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Monthly Price"
            value={prop.lease?.monthlyPrice ?? ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              updateLease(i, "monthlyPrice", isNaN(val) ? 0 : val);
            }}
            className="w-full border p-2 rounded"
          />
        </div>
      ))}

      <div className="flex justify-between mt-6">
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
          {isLoading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};
