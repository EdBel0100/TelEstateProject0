"use client";

import { useState } from "react";
import { BuildingCreateModal } from "./modal/createbuilding/BuildingCreateModal";
import { BuildingUpdateModal } from "./modal/updateBuilding/BuildingUpdateModal";
import { BuildingDeleteConfirmModal } from "./modal/deleteBuilding/BuildingDeleteConfirmModal";
import { BuildingCard } from "./BuildingCard";
import { useGetBuildingsByManagerQuery, useDeleteBuildingMutation } from "@/state/api";
import { IconPlus } from "@tabler/icons-react";
import { useUser } from "@/hooks/useUser";

export default function ManageBuildings() {
  const user = useUser();
  const managerCognitoId = user?.username;

  const {
    data: buildings = [],
    isLoading,
    isError,
    refetch,
  } = useGetBuildingsByManagerQuery(
    { managerCognitoId: managerCognitoId! },
    { skip: !managerCognitoId }
  );

  const [deleteBuilding, { isLoading: isDeleting }] = useDeleteBuildingMutation();

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<any>(null);

  // Open create modal
  const handleOpenCreate = () => {
    setEditData(null);
    setIsCreateOpen(true);
  };

  // Open update modal
  const handleOpenEdit = (building: any) => {
    setEditData(building);
    setIsUpdateOpen(true);
  };

  // Open delete modal
  const handleOpenDelete = (building: any) => {
    setBuildingToDelete(building);
    setIsDeleteOpen(true);
  };

  // Create submit handler
  const handleCreateSubmit = (values: { name: string; typeOfBuilding: string; photosUrl: string }) => {
    console.log("Create building:", values);
    setIsCreateOpen(false);
  };

  // Update submit handler
  const handleUpdateSubmit = (values: { name: string; typeOfBuilding: string; photosUrl: string }) => {
    console.log("Update building:", { id: editData?.id, ...values });
    setIsUpdateOpen(false);
    setEditData(null);
  };

  // Delete confirm handler with mutation
  const handleDeleteConfirm = async () => {
    if (!buildingToDelete) return;

    try {
      await deleteBuilding({ id: buildingToDelete.id }).unwrap();
      setIsDeleteOpen(false);
      setBuildingToDelete(null);

      // Refresh building list after deletion
      await refetch();
    } catch (error) {
      console.error("Failed to delete building", error);
      // Optionally: show error toast/message
    }
  };

  if (!managerCognitoId) return <div className="text-red-500">User not found</div>;
  if (isLoading) return <div>Loading buildings...</div>;
  if (isError) return <div className="text-red-500">Error loading buildings</div>;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Buildings</h2>
        <button
          className="w-12 h-12 flex items-center justify-center bg-white dark:bg-neutral-800 text-primary-700 dark:text-white shadow-md rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
          onClick={handleOpenCreate}
          aria-label="Create new building"
        >
          <IconPlus className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {buildings.map((building) => (
          <BuildingCard
            key={building.id}
            building={building}
            onEdit={() => handleOpenEdit(building)}
            onDelete={() => handleOpenDelete(building)}
          />
        ))}
      </div>

      {/* CREATE MODAL */}
      <BuildingCreateModal
        isOpen={isCreateOpen}
        onRequestClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* UPDATE MODAL */}
      <BuildingUpdateModal
        isOpen={isUpdateOpen}
        onRequestClose={() => {
          setIsUpdateOpen(false);
          setEditData(null);
        }}
        onSubmit={handleUpdateSubmit}
        initialData={editData}
      />

      {/* DELETE CONFIRM MODAL */}
      <BuildingDeleteConfirmModal
        isOpen={isDeleteOpen}
        onRequestClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        buildingName={buildingToDelete?.name || ""}
      />
    </div>
  );
}
