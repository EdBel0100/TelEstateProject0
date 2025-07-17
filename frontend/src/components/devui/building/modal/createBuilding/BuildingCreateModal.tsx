import React from "react";
import Modal from "react-modal";
import { BuildingCreateForm } from "./BuildingCreateInput";
import { CreateBuildingDto } from "@DTO/building-dto/create-building.dto";

interface BuildingCreateModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (data: CreateBuildingDto) => void;
}

export const BuildingCreateModal: React.FC<BuildingCreateModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Building"
      className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-2xl w-full mx-auto outline-none shadow-lg max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black/30 z-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-semibold mb-4">Scaffold New Building</h2>
      <BuildingCreateForm
        onSubmit={(data) => {
          onSubmit(data);
          onRequestClose();
        }}
        onCancel={onRequestClose}
      />
    </Modal>
  );
};
