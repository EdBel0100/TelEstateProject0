"use client";

import { useState } from "react";
import { BuildingCreateModal } from "./modal/createbuilding/BuildingCreateModal";
import { BuildingUpdateModal } from "./modal/updateBuilding/BuildingUpdateModal";
import { BuildingDeleteConfirmModal } from "./modal/deleteBuilding/BuildingDeleteConfirmModal";
import { BuildingCard } from "./BuildingCard";
import { useGetBuildingsByManagerQuery, useDeleteBuildingMutation } from "@/state/api";
import { IconPlus } from "@tabler/icons-react";
import { useUser } from "@/hooks/useUser";
import { CreateBuildingDto } from "@DTO/building-dto/create-building.dto";
import { UpdateBuildingDto } from "@DTO/building-dto/update-building.dto";

export default function ManageBuildings() {
  const user = useUser();
  const managerCognitoId = user?.attributes?.sub;

  // Always call hooks
  const {
    data: buildings = [],
    isLoading,
    isError,
    refetch,
  } = useGetBuildingsByManagerQuery(
    { managerCognitoId: managerCognitoId ?? "" },
    { skip: !managerCognitoId }
  );

  const [deleteBuilding, { isLoading: isDeleting }] = useDeleteBuildingMutation();

  // Modal state hooks
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<any>(null);

  // Handlers remain the same
  const handleOpenCreate = () => {
    setEditData(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (building: any) => {
    setEditData(building);
    setIsUpdateOpen(true);
  };

  const handleOpenDelete = (building: any) => {
    setBuildingToDelete(building);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = async (values: CreateBuildingDto) => {
    setIsCreateOpen(false);
    await refetch();
  };

  const handleUpdateSubmit = async (values: UpdateBuildingDto) => {
    setIsUpdateOpen(false);
    await refetch();
    setEditData(null);
  };

  const handleDeleteConfirm = async () => {
    if (!buildingToDelete) return;
    try {
      await deleteBuilding({ id: buildingToDelete.id }).unwrap();
      setIsDeleteOpen(false);
      setBuildingToDelete(null);
      await refetch();
    } catch (error) {
      console.error("Failed to delete building", error);
    }
  };

  // Render conditional UI inside the return, no early returns
  return (
    <div className="flex flex-col space-y-6">
      {!managerCognitoId && <div className="text-red-500">User not found</div>}

      {isLoading && <div>Loading buildings...</div>}

      {isError && <div className="text-red-500">Error loading buildings</div>}

      {!isLoading && !isError && managerCognitoId && buildings.length === 0 && (
        <h1>No buildings found</h1>
      )}

      {buildings.length > 0 && (
        <>
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
        </>
      )}

      {/* Modals */}
      <BuildingCreateModal
        isOpen={isCreateOpen}
        onRequestClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <BuildingUpdateModal
        isOpen={isUpdateOpen}
        onRequestClose={() => {
          setIsUpdateOpen(false);
          setEditData(null);
        }}
        onSubmit={handleUpdateSubmit}
        initialData={editData}
      />

      <BuildingDeleteConfirmModal
        isOpen={isDeleteOpen}
        onRequestClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        buildingName={buildingToDelete?.name || ""}
      />
    </div>
  );
}
