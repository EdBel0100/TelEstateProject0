// BuildingUpdateModal.tsx
import React from "react";
import Modal from "react-modal";
import { BuildingUpdateForm } from "./BuidlingUpdateInput";
import type { UpdateBuildingDto } from "@DTO/building-dto/update-building.dto";

interface BuildingUpdateModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (data: UpdateBuildingDto) => void;
  initialData: UpdateBuildingDto; // Make initialData required for update form
}

export const BuildingUpdateModal: React.FC<BuildingUpdateModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
  initialData,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Building"
      className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-2xl w-full mx-auto outline-none shadow-lg max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black/30 z-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-semibold mb-4">Renovate Building</h2>
      <BuildingUpdateForm
        initialData={initialData}
        onSubmit={(data) => {
          onSubmit(data);
          onRequestClose();
        }}
        
        onCancel={onRequestClose}
      />
    </Modal>
  );
};
